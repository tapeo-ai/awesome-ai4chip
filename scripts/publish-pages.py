#!/usr/bin/env python3
"""Trusted Pages publisher. Run only from main, never from a PR checkout.

The build artifact is data: only regular ZIP members are copied. We never run
its scripts, install its dependencies, or extract a nested archive. gh-pages
stores the root site and /pr-preview/<number>/ between official Pages deploys.
"""

from __future__ import annotations

import base64
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from dataclasses import dataclass


REPOSITORY = "tapeo-ai/awesome-ai4chip"
WORKFLOW = ".github/workflows/docs-build.yml"
BASE_URL = "https://tapeo-ai.github.io/awesome-ai4chip/"
MAX_ARCHIVE = 100 * 1024 * 1024
MAX_SITE = 250 * 1024 * 1024
MAX_COMBINED = 800 * 1024 * 1024
MAX_FILES = 20_000
SHA = re.compile(r"^[0-9a-f]{40}$")


class PublishError(Exception):
    pass


class SkipPublish(Exception):
    pass


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, new_url):
        # Do not forward the GitHub token to the signed artifact-storage URL.
        return None


class API:
    def __init__(self, token):
        self.token = token
        self.opener = urllib.request.build_opener(NoRedirect)

    def request(self, path):
        if not path.startswith("/") or ".." in path:
            raise PublishError("Invalid API path")
        return urllib.request.Request(
            f"https://api.github.com/repos/{REPOSITORY}{path}",
            headers={
                "Authorization": f"Bearer {self.token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "awesome-ai4chip-pages",
            },
        )

    def get(self, path):
        try:
            with self.opener.open(self.request(path), timeout=60) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            raise PublishError(f"GitHub API request failed (HTTP {error.code})") from None

    def pages(self, path, field=None):
        for page in range(1, 101):
            result = self.get(f"{path}?per_page=100&page={page}")
            items = result[field] if field else result
            yield from items
            if len(items) < 100:
                return
        raise PublishError("API pagination limit exceeded")

    def download(self, artifact_id, destination):
        try:
            response = self.opener.open(
                self.request(f"/actions/artifacts/{artifact_id}/zip"), timeout=60
            )
        except urllib.error.HTTPError as error:
            if error.code not in (301, 302, 303, 307, 308):
                raise PublishError(f"Artifact download failed (HTTP {error.code})") from None
            location = error.headers.get("Location", "")
            parsed = urllib.parse.urlsplit(location)
            if parsed.scheme != "https" or not parsed.netloc or parsed.username or parsed.password:
                raise PublishError("Artifact redirect must be an HTTPS URL")
            # A fresh, unauthenticated request; no token leaves api.github.com.
            response = urllib.request.urlopen(location, timeout=60)
        with response, destination.open("wb") as output:
            total = 0
            while chunk := response.read(1024 * 1024):
                total += len(chunk)
                if total > MAX_ARCHIVE:
                    raise PublishError("Artifact exceeds the download size limit")
                output.write(chunk)


def number(value):
    if isinstance(value, bool) or not isinstance(value, int) or value < 1:
        raise PublishError("Invalid GitHub numeric identifier")
    return value


def repository_name(value):
    return (value or {}).get("full_name")


@dataclass(frozen=True)
class Target:
    sha: str | None
    pr: int | None
    cleanup: bool = False
    attempt: int | None = None

    @property
    def url(self):
        return BASE_URL + (f"pr-preview/{self.pr}/" if self.pr and not self.cleanup else "")


def validate_pr(pr, sha=None, closed=False):
    if repository_name(pr.get("base", {}).get("repo")) != REPOSITORY or pr["base"]["ref"] != "main":
        raise PublishError("PR does not target this repository's main branch")
    if pr.get("state") != ("closed" if closed else "open"):
        raise SkipPublish("PR state changed; nothing to publish")
    if sha is not None and pr.get("head", {}).get("sha") != sha:
        raise SkipPublish("A newer PR commit exists; ignoring the old build")


def resolve_target(api, event_name, event):
    if repository_name(event.get("repository")) != REPOSITORY:
        raise PublishError("Event belongs to a different repository")
    if event_name == "pull_request_target":
        if event.get("action") != "closed":
            raise PublishError("Only closed PR events may clean up previews")
        pr_number = number(event["number"])
        validate_pr(api.get(f"/pulls/{pr_number}"), closed=True)
        return Target(None, pr_number, True), None
    if event_name != "workflow_run":
        raise PublishError("Unsupported publishing event")

    run_id = number(event["workflow_run"]["id"])
    run = api.get(f"/actions/runs/{run_id}")
    workflow = api.get("/actions/workflows/docs-build.yml")
    if (
        repository_name(run.get("repository")) != REPOSITORY
        or run.get("workflow_id") != workflow.get("id")
        or run.get("path", "").split("@", 1)[0] != WORKFLOW
        or run.get("status") != "completed"
        or run.get("conclusion") != "success"
    ):
        raise PublishError("Build repository, workflow, or completion status is invalid")
    sha = run.get("head_sha", "")
    if not SHA.fullmatch(sha):
        raise PublishError("Invalid build commit SHA")
    attempt = number(run.get("run_attempt"))
    if attempt != number(event["workflow_run"].get("run_attempt")):
        raise SkipPublish("A newer build attempt exists; ignoring the old completion event")
    if run.get("event") == "push":
        if run.get("head_branch") != "main" or repository_name(run.get("head_repository")) != REPOSITORY:
            raise PublishError("Production builds must come from main in this repository")
        target = Target(sha, None, attempt=attempt)
    elif run.get("event") == "pull_request":
        # GitHub sometimes leaves workflow_run.pull_requests empty for forks.
        # Both associations below are obtained from GitHub, never from the ZIP.
        candidates = run.get("pull_requests") or list(api.pages(f"/commits/{sha}/pulls"))
        matching = []
        for candidate in candidates:
            pr_number = number(candidate["number"])
            pr = api.get(f"/pulls/{pr_number}")
            try:
                validate_pr(pr, sha)
            except SkipPublish:
                continue
            head_repository = repository_name(pr.get("head", {}).get("repo"))
            if head_repository is None:
                continue
            # Depending on the PR event, GitHub may report the base or fork here.
            # The source SHA must still be the current head of the associated PR.
            if repository_name(run.get("head_repository")) not in (REPOSITORY, head_repository):
                raise PublishError("Build source repository does not match the PR")
            matching.append(pr_number)
        if len(set(matching)) != 1:
            raise SkipPublish("No unambiguous open PR at the build SHA; skipping")
        target = Target(sha, matching[0], attempt=attempt)
    else:
        raise PublishError("Only push and pull_request builds may publish")
    ensure_current(api, target)
    return target, run_id


def ensure_current(api, target):
    if target.pr:
        validate_pr(api.get(f"/pulls/{target.pr}"), target.sha, target.cleanup)
    elif api.get("/git/ref/heads/main")["object"]["sha"] != target.sha:
        raise SkipPublish("A newer main commit exists; ignoring the old build")


def checked_parts(name):
    # Do not normalize before checking: that would hide '..', '.', and '//'.
    if not name or "\\" in name or any(ord(char) < 32 or ord(char) == 127 for char in name):
        raise PublishError("Unsafe archive member name")
    parts = name.rstrip("/").split("/")
    if any(not part or part in (".", "..") or ":" in part for part in parts):
        raise PublishError("Archive contains an absolute or traversing path")
    if any(part.lower().startswith(".git") for part in parts):
        raise PublishError("Git control files are not static site content")
    if parts[0].lower() in ("pr-preview", "cname"):
        raise PublishError("Artifact attempts to replace publisher-managed paths")
    return parts


def extract_site(archive, destination):
    """Manually extract regular ZIP members; never use extractall or tar."""
    destination.mkdir()
    seen = set()
    total = 0
    with zipfile.ZipFile(archive) as package:
        members = package.infolist()
        if len(members) > MAX_FILES:
            raise PublishError("Too many artifact entries")
        for member in members:
            # ZipInfo truncates filename at NUL; inspect orig_filename as well.
            parts = checked_parts(member.orig_filename)
            key = "/".join(parts).casefold()
            if key in seen:
                raise PublishError("Duplicate or case-colliding artifact path")
            seen.add(key)
            kind = stat.S_IFMT(member.external_attr >> 16)
            allowed = (0, stat.S_IFDIR) if member.is_dir() else (0, stat.S_IFREG)
            if kind not in allowed or member.flag_bits & 1:
                raise PublishError("Links, special files, and encrypted entries are forbidden")
            total += member.file_size
            if total > MAX_SITE:
                raise PublishError("Extracted artifact exceeds the size limit")
            path = destination.joinpath(*parts)
            if member.is_dir():
                path.mkdir(parents=True, exist_ok=True)
                continue
            path.parent.mkdir(parents=True, exist_ok=True)
            with package.open(member) as source, path.open("xb") as output:
                shutil.copyfileobj(source, output, length=1024 * 1024)
            path.chmod(0o644)
    if not (destination / "index.html").is_file() or not (destination / "index.html").stat().st_size:
        raise PublishError("Static artifact must contain a nonempty root index.html")


def fetch_site(api, run_id, sha, attempt, directory):
    # GitHub retains artifacts from previous attempts of the same workflow run.
    # Bind selection to the attempt verified by resolve_target, not just its SHA.
    matches = [
        item for item in api.pages(f"/actions/runs/{run_id}/artifacts", "artifacts")
        if item.get("name") == f"site-{sha}-attempt-{attempt}" and not item.get("expired")
    ]
    if len(matches) != 1:
        raise PublishError("Expected exactly one unexpired site artifact for this build attempt")
    artifact = matches[0]
    if artifact.get("size_in_bytes", MAX_ARCHIVE + 1) > MAX_ARCHIVE:
        raise PublishError("Artifact exceeds the download size limit")
    archive = directory / "site.zip"
    api.download(number(artifact["id"]), archive)
    digest = artifact.get("digest")
    if digest and digest != "sha256:" + hashlib.sha256(archive.read_bytes()).hexdigest():
        raise PublishError("Artifact digest does not match GitHub's digest")
    destination = directory / "extracted"
    extract_site(archive, destination)
    return destination


def git(directory, token, *arguments):
    # Credentials exist only in the child environment, not argv or .git/config.
    environment = dict(os.environ)
    for key in list(environment):
        if key.startswith("GIT_"):
            del environment[key]
    credential = base64.b64encode(f"x-access-token:{token}".encode()).decode()
    environment.update({
        "GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull,
        "GIT_TERMINAL_PROMPT": "0", "GIT_CONFIG_COUNT": "1",
        "GIT_CONFIG_KEY_0": "http.https://github.com/.extraheader",
        "GIT_CONFIG_VALUE_0": f"AUTHORIZATION: basic {credential}",
    })
    result = subprocess.run(
        ["git", "-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false", *arguments],
        cwd=directory, env=environment, capture_output=True, text=True,
    )
    if result.returncode:
        raise PublishError(f"git {arguments[0]} failed (exit {result.returncode})")
    return result.stdout.strip()


def checkout_pages(directory, token):
    directory.mkdir()
    git(directory, token, "init", "--quiet")
    git(directory, token, "remote", "add", "origin", f"https://github.com/{REPOSITORY}.git")
    exists = bool(git(directory, token, "ls-remote", "--heads", "origin", "gh-pages"))
    if exists:
        git(directory, token, "fetch", "--depth=1", "origin", "refs/heads/gh-pages")
        git(directory, token, "checkout", "-b", "gh-pages", "FETCH_HEAD")
    else:
        git(directory, token, "checkout", "--orphan", "gh-pages")
    return exists


def validate_tree(directory):
    total = 0
    for root, directories, files in os.walk(directory, followlinks=False):
        if Path(root) == directory:
            directories[:] = [name for name in directories if name != ".git"]
        for name in directories + files:
            path = Path(root) / name
            if path.is_symlink() or (not path.is_file() and not path.is_dir()):
                raise PublishError("Stored Pages tree contains a link or special file")
            if name.lower().startswith(".git"):
                raise PublishError("Stored Pages tree contains Git control files")
            if path.is_file():
                total += path.stat().st_size
                if total > MAX_COMBINED:
                    raise PublishError("Combined Pages site exceeds the size limit")


def remove(path):
    if path.is_dir():
        shutil.rmtree(path)
    elif path.exists():
        path.unlink()


def assemble(directory, site, target):
    validate_tree(directory)
    if target.pr:
        destination = directory / "pr-preview" / str(target.pr)
        remove(destination)
        if not target.cleanup:
            shutil.copytree(site, destination)
    else:
        for child in directory.iterdir():
            if child.name not in (".git", "pr-preview"):
                remove(child)
        for child in site.iterdir():
            if child.is_dir():
                shutil.copytree(child, directory / child.name)
            else:
                shutil.copy2(child, directory / child.name)
    if not (directory / "index.html").exists():
        (directory / "index.html").write_text(
            '<!doctype html><html lang="en"><meta charset="utf-8">'
            '<title>Awesome AI4Chip</title><h1>Awesome AI4Chip</h1>'
            '<p>The production documentation has not been published yet.</p>'
            f'<p><a href="https://github.com/{REPOSITORY}">Project repository</a></p></html>\n'
        )
    (directory / ".nojekyll").touch()
    validate_tree(directory)


def output(name, value):
    with open(os.environ["GITHUB_OUTPUT"], "a") as stream:
        stream.write(f"{name}={value}\n")


def main():
    if os.environ.get("GITHUB_REPOSITORY") != REPOSITORY:
        raise PublishError("Publisher is restricted to its configured repository")
    token = os.environ["GH_TOKEN"]
    api = API(token)
    event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
    target, run_id = resolve_target(api, os.environ["GITHUB_EVENT_NAME"], event)
    with tempfile.TemporaryDirectory(prefix="pages-publish-") as temporary:
        directory = Path(temporary)
        site = fetch_site(api, run_id, target.sha, target.attempt, directory) if not target.cleanup else None
        checkout = directory / "pages"
        exists = checkout_pages(checkout, token)
        if target.cleanup and not exists:
            raise SkipPublish("There is no stored Pages site to clean up")
        # Even if a previous cleanup already removed the directory from gh-pages,
        # redeploy: that attempt may have failed after pushing storage changes.
        assemble(checkout, site, target)
        git(checkout, token, "add", "--all")
        changed = bool(git(checkout, token, "diff", "--cached", "--name-only"))
        # Recheck after download/build assembly, immediately before updating storage.
        ensure_current(api, target)
        if changed:
            git(checkout, token, "-c", "user.name=github-actions[bot]", "-c",
                "user.email=41898282+github-actions[bot]@users.noreply.github.com", "commit",
                "-m", f"{'Remove' if target.cleanup else 'Publish'} documentation "
                + (f"for PR #{target.pr}" if target.pr else target.sha))
            git(checkout, token, "push", "origin", "HEAD:refs/heads/gh-pages")
        destination = Path(os.environ["PUBLISH_DIR"])
        if destination.exists():
            raise PublishError("Publish output directory must be fresh")
        shutil.copytree(checkout, destination, ignore=shutil.ignore_patterns(".git"))
        output("url", target.url)
        output("publish", "true")
        print("Validated and assembled the Pages site.")


if __name__ == "__main__":
    try:
        main()
    except SkipPublish as error:
        output("publish", "false")
        print(str(error))
    except (PublishError, OSError, ValueError, KeyError, zipfile.BadZipFile) as error:
        # Avoid displaying HTTP redirects, credentials, or untrusted archive names.
        print(f"Publisher failed: {error if isinstance(error, PublishError) else type(error).__name__}", file=sys.stderr)
        sys.exit(1)
