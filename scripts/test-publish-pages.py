#!/usr/bin/env python3
"""Offline regression tests for the privileged publisher's trust boundaries."""

import copy
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import stat
import sys
import tempfile
import unittest
from unittest.mock import patch
import urllib.error
import warnings
import zipfile

spec = importlib.util.spec_from_file_location("publish_pages", Path(__file__).with_name("publish-pages.py"))
publisher = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = publisher
spec.loader.exec_module(publisher)

SHA = "a" * 40
REPO = {"full_name": publisher.REPOSITORY}
PR = {
    "number": 12, "state": "open",
    "base": {"repo": REPO, "ref": "main"},
    "head": {"repo": {"full_name": "contributor/fork"}, "sha": SHA},
}
RUN = {
    "repository": REPO, "workflow_id": 5, "path": publisher.WORKFLOW,
    "run_attempt": 1,
    "status": "completed", "conclusion": "success", "event": "pull_request",
    "head_sha": SHA, "head_branch": "contribution", "pull_requests": [{"number": 12}],
    "head_repository": {"full_name": "contributor/fork"},
}
EVENT = {"repository": REPO, "workflow_run": {"id": 8, "run_attempt": 1}}


class FakeAPI:
    def __init__(self):
        self.responses = copy.deepcopy({
            "/actions/runs/8": RUN,
            "/actions/workflows/docs-build.yml": {"id": 5},
            "/pulls/12": PR,
            f"/commits/{SHA}/pulls": [{"number": 12}],
            "/git/ref/heads/main": {"object": {"sha": SHA}},
        })

    def get(self, path):
        return self.responses[path]

    def pages(self, path, field=None):
        return iter(self.responses[path])


class SourceValidationTests(unittest.TestCase):
    def setUp(self):
        self.api = FakeAPI()

    def test_current_fork_pr_is_associated_by_github(self):
        target, run_id = publisher.resolve_target(self.api, "workflow_run", EVENT)
        self.assertEqual((target.sha, target.pr, target.attempt, run_id), (SHA, 12, 1, 8))
        self.assertEqual(target.url, publisher.BASE_URL + "pr-preview/12/")

    def test_fork_with_empty_run_associations_uses_commit_api(self):
        self.api.responses["/actions/runs/8"]["pull_requests"] = []
        target, _ = publisher.resolve_target(self.api, "workflow_run", EVENT)
        self.assertEqual(target.pr, 12)

    def test_workflow_api_path_may_include_ref_suffix(self):
        self.api.responses["/actions/runs/8"]["path"] += "@main"
        publisher.resolve_target(self.api, "workflow_run", EVENT)

    def test_completed_attempt_is_verified_against_the_api(self):
        self.api.responses["/actions/runs/8"]["run_attempt"] = 2
        with self.assertRaises(publisher.SkipPublish):
            publisher.resolve_target(self.api, "workflow_run", EVENT)
        event = {**EVENT, "workflow_run": {"id": 8, "run_attempt": 2}}
        target, _ = publisher.resolve_target(self.api, "workflow_run", event)
        self.assertEqual(target.attempt, 2)

    def test_wrong_repository_workflow_and_failed_run_are_rejected(self):
        for key, value in (
            ("repository", {"full_name": "attacker/repo"}),
            ("workflow_id", 99), ("path", ".github/workflows/other.yml"),
            ("conclusion", "failure"), ("status", "in_progress"),
            ("event", "workflow_dispatch"), ("head_sha", "../../main"),
            ("head_repository", {"full_name": "unrelated/source"}),
            ("run_attempt", 0),
        ):
            with self.subTest(key=key):
                api = FakeAPI()
                api.responses["/actions/runs/8"][key] = value
                with self.assertRaises(publisher.PublishError):
                    publisher.resolve_target(api, "workflow_run", EVENT)

    def test_other_event_repository_is_rejected(self):
        event = {**EVENT, "repository": {"full_name": "attacker/repo"}}
        with self.assertRaises(publisher.PublishError):
            publisher.resolve_target(self.api, "workflow_run", event)

    def test_stale_or_closed_pr_is_not_published(self):
        for key, value in (("state", "closed"), ("head", {"sha": "b" * 40})):
            with self.subTest(key=key):
                api = FakeAPI()
                api.responses["/pulls/12"][key] = value
                with self.assertRaises(publisher.SkipPublish):
                    publisher.resolve_target(api, "workflow_run", EVENT)

    def test_multiple_prs_at_same_commit_are_not_guessed(self):
        self.api.responses["/actions/runs/8"]["pull_requests"].append({"number": 13})
        self.api.responses["/pulls/13"] = copy.deepcopy(PR)
        with self.assertRaises(publisher.SkipPublish):
            publisher.resolve_target(self.api, "workflow_run", EVENT)

    def test_main_build_requires_current_main_sha(self):
        run = self.api.responses["/actions/runs/8"]
        run.update(event="push", head_branch="main", head_repository=REPO)
        target, _ = publisher.resolve_target(self.api, "workflow_run", EVENT)
        self.assertIsNone(target.pr)
        self.api.responses["/git/ref/heads/main"]["object"]["sha"] = "b" * 40
        with self.assertRaises(publisher.SkipPublish):
            publisher.ensure_current(self.api, target)

    def test_branch_named_main_in_a_fork_cannot_publish_production(self):
        self.api.responses["/actions/runs/8"].update(
            event="push", head_branch="main", head_repository={"full_name": "attacker/fork"}
        )
        with self.assertRaises(publisher.PublishError):
            publisher.resolve_target(self.api, "workflow_run", EVENT)

    def test_cleanup_rechecks_closed_state(self):
        event = {"repository": REPO, "action": "closed", "number": 12}
        self.api.responses["/pulls/12"]["state"] = "closed"
        target, run_id = publisher.resolve_target(self.api, "pull_request_target", event)
        self.assertTrue(target.cleanup)
        self.assertIsNone(run_id)
        self.api.responses["/pulls/12"]["state"] = "open"
        with self.assertRaises(publisher.SkipPublish):
            publisher.ensure_current(self.api, target)


class ArchiveTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.directory = Path(self.temporary.name)

    def archive(self, members):
        archive = self.directory / "site.zip"
        with warnings.catch_warnings(), zipfile.ZipFile(archive, "w") as package:
            warnings.simplefilter("ignore", UserWarning)
            for name, content in members:
                package.writestr(name, content)
        return archive

    def test_normal_site_is_extracted_as_nonexecutable_regular_files(self):
        archive = self.archive([
            ("index.html", "<h1>Hello</h1>"), ("_astro/main.js", "/* static */"),
            ("guide/index.html", "中文"),
        ])
        destination = self.directory / "site"
        publisher.extract_site(archive, destination)
        self.assertEqual((destination / "guide/index.html").read_text(), "中文")
        self.assertEqual(stat.S_IMODE((destination / "index.html").stat().st_mode), 0o644)

    def test_traversal_absolute_git_controls_and_reserved_paths_are_rejected(self):
        for index, name in enumerate([
            "../escaped", "/absolute", "a/../../escaped", "a/./b", "a//b", "C:/file",
            "a\\..\\escaped", ".git/config", "nested/.gitattributes", ".github/workflows/run.yml",
            "pr-preview/13/index.html", "CNAME", "bad\nname", "index.html\x00ignored",
        ]):
            with self.subTest(name=name):
                # NUL is tested directly because zipfile truncates it on write.
                if "\x00" in name:
                    with self.assertRaises(publisher.PublishError):
                        publisher.checked_parts(name)
                    continue
                archive = self.archive([("index.html", "ok"), (name, "bad")])
                with self.assertRaises(publisher.PublishError):
                    publisher.extract_site(archive, self.directory / f"site-{index}")
                self.assertFalse((self.directory / "escaped").exists())

    def test_symlinks_and_special_members_are_rejected(self):
        for index, kind in enumerate((stat.S_IFLNK, stat.S_IFIFO, stat.S_IFSOCK)):
            member = zipfile.ZipInfo("payload")
            member.create_system = 3
            member.external_attr = (kind | 0o777) << 16
            archive = self.archive([("index.html", "ok"), (member, "../../outside")])
            with self.assertRaises(publisher.PublishError):
                publisher.extract_site(archive, self.directory / f"site-{index}")

    def test_duplicates_and_case_collisions_are_rejected(self):
        for index, name in enumerate(("index.html", "INDEX.HTML")):
            archive = self.archive([("index.html", "ok"), (name, "replacement")])
            with self.assertRaises(publisher.PublishError):
                publisher.extract_site(archive, self.directory / f"site-{index}")

    def test_size_and_count_limits_are_enforced(self):
        archive = self.archive([("index.html", "more than five bytes")])
        with patch.object(publisher, "MAX_SITE", 5), self.assertRaises(publisher.PublishError):
            publisher.extract_site(archive, self.directory / "site-size")
        with patch.object(publisher, "MAX_FILES", 0), self.assertRaises(publisher.PublishError):
            publisher.extract_site(archive, self.directory / "site-count")

    def test_empty_or_absent_index_is_rejected(self):
        for index, members in enumerate(([('index.html', '')], [('main.js', '/* */')])):
            with self.assertRaises(publisher.PublishError):
                publisher.extract_site(self.archive(members), self.directory / f"site-{index}")

    def test_nested_archive_is_a_file_and_never_extracted(self):
        nested = io.BytesIO()
        with zipfile.ZipFile(nested, "w") as package:
            package.writestr("../../escape", "bad")
        archive = self.archive([("index.html", "ok"), ("sample.zip", nested.getvalue())])
        publisher.extract_site(archive, self.directory / "site")
        self.assertFalse((self.directory / "escape").exists())
        self.assertTrue((self.directory / "site/sample.zip").is_file())

    def test_download_strips_authorization_on_storage_redirect(self):
        api = publisher.API("sensitive-token")
        location = "https://storage.example/signed-artifact"
        error = urllib.error.HTTPError("https://api.github.com/", 302, "Found", {"Location": location}, None)
        with patch.object(api.opener, "open", side_effect=error), patch.object(
            publisher.urllib.request, "urlopen", return_value=io.BytesIO(b"zip")
        ) as storage:
            api.download(1, self.directory / "download.zip")
        storage.assert_called_once_with(location, timeout=60)

    def test_rerun_selects_only_the_verified_attempt_artifact(self):
        archive = self.archive([("index.html", "current attempt")])
        api = FakeAPI()
        api.responses["/actions/runs/8/artifacts"] = [
            {"id": 10, "name": f"site-{SHA}-attempt-1", "expired": False},
            {"id": 11, "name": f"site-{SHA}-attempt-2", "expired": False,
             "size_in_bytes": archive.stat().st_size,
             "digest": "sha256:" + hashlib.sha256(archive.read_bytes()).hexdigest()},
        ]
        staging = self.directory / "download"
        staging.mkdir()
        with patch.object(api, "download", create=True,
                          side_effect=lambda artifact_id, destination: destination.write_bytes(archive.read_bytes())) as download:
            destination = publisher.fetch_site(api, 8, SHA, 2, staging)
        self.assertEqual(download.call_args.args[0], 11)
        self.assertEqual((destination / "index.html").read_text(), "current attempt")

    def test_missing_current_attempt_never_falls_back_to_old_artifact(self):
        api = FakeAPI()
        api.responses["/actions/runs/8/artifacts"] = [
            {"id": 10, "name": f"site-{SHA}-attempt-1", "expired": False},
        ]
        with self.assertRaises(publisher.PublishError):
            publisher.fetch_site(api, 8, SHA, 2, self.directory)


class AssemblyTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.directory = Path(self.temporary.name)
        self.pages = self.directory / "pages"
        self.pages.mkdir()
        (self.pages / ".git").mkdir()
        (self.pages / ".git/config").write_text("trusted git metadata")
        self.site = self.directory / "built"
        self.site.mkdir()
        (self.site / "index.html").write_text("new")
        (self.pages / "index.html").write_text("production")
        (self.pages / "old.css").write_text("old")
        for pr in (12, 13):
            destination = self.pages / "pr-preview" / str(pr)
            destination.mkdir(parents=True)
            (destination / "index.html").write_text(f"preview {pr}")

    def test_production_update_keeps_all_previews_and_removes_old_assets(self):
        publisher.assemble(self.pages, self.site, publisher.Target(SHA, None))
        self.assertEqual((self.pages / "index.html").read_text(), "new")
        self.assertFalse((self.pages / "old.css").exists())
        self.assertEqual((self.pages / "pr-preview/12/index.html").read_text(), "preview 12")
        self.assertEqual((self.pages / ".git/config").read_text(), "trusted git metadata")

    def test_pr_update_does_not_change_production_or_other_preview(self):
        publisher.assemble(self.pages, self.site, publisher.Target(SHA, 12))
        self.assertEqual((self.pages / "pr-preview/12/index.html").read_text(), "new")
        self.assertEqual((self.pages / "pr-preview/13/index.html").read_text(), "preview 13")
        self.assertEqual((self.pages / "index.html").read_text(), "production")

    def test_cleanup_only_removes_named_preview(self):
        publisher.assemble(self.pages, None, publisher.Target(None, 12, True))
        self.assertFalse((self.pages / "pr-preview/12").exists())
        self.assertTrue((self.pages / "pr-preview/13/index.html").exists())
        self.assertEqual((self.pages / "index.html").read_text(), "production")

    def test_existing_branch_symlink_cannot_escape_tree(self):
        (self.pages / "pr-preview/12/link").symlink_to(self.site, target_is_directory=True)
        with self.assertRaises(publisher.PublishError):
            publisher.assemble(self.pages, None, publisher.Target(None, 12, True))
        self.assertEqual((self.site / "index.html").read_text(), "new")


class EndToEndTests(unittest.TestCase):
    def test_git_storage_production_preview_production_cleanup_and_cleanup_retry(self):
        """Exercise real git commits/pushes against a temporary local bare remote."""
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)
            remote = directory / "remote.git"
            remote.mkdir()
            real_git = publisher.git
            real_git(remote, "test-token", "init", "--bare", "--quiet")

            def local_git(workdir, token, *arguments):
                if arguments[:3] == ("remote", "add", "origin"):
                    arguments = (*arguments[:3], str(remote))
                return real_git(workdir, token, *arguments)

            api = FakeAPI()
            archive = directory / "artifact.zip"
            event_file = directory / "event.json"
            event_file.write_text(json.dumps(EVENT))
            output_file = directory / "outputs"
            environment = {
                "GITHUB_REPOSITORY": publisher.REPOSITORY, "GH_TOKEN": "test-token",
                "GITHUB_EVENT_PATH": str(event_file), "GITHUB_EVENT_NAME": "workflow_run",
                "GITHUB_OUTPUT": str(output_file),
            }
            for index, (kind, content) in enumerate([
                ("production", "main one"), ("preview", "preview twelve"),
                ("production", "main two"), ("cleanup", "unused"),
                ("cleanup", "retry after a failed Pages deployment"),
            ]):
                with zipfile.ZipFile(archive, "w") as package:
                    package.writestr("index.html", content)
                api.responses["/actions/runs/8/artifacts"] = [{
                    "id": 9, "name": f"site-{SHA}-attempt-1", "expired": False,
                    "size_in_bytes": archive.stat().st_size,
                    "digest": "sha256:" + hashlib.sha256(archive.read_bytes()).hexdigest(),
                }]
                api.download = lambda artifact_id, destination: destination.write_bytes(archive.read_bytes())
                if kind == "cleanup":
                    api.responses["/pulls/12"]["state"] = "closed"
                    environment["GITHUB_EVENT_NAME"] = "pull_request_target"
                    event_file.write_text(json.dumps({"repository": REPO, "action": "closed", "number": 12}))
                else:
                    run = api.responses["/actions/runs/8"]
                    run.update(event="push" if kind == "production" else "pull_request",
                               head_branch="main" if kind == "production" else "contribution",
                               head_repository=REPO)
                destination = directory / f"published-{index}"
                environment["PUBLISH_DIR"] = str(destination)
                with patch.dict(os.environ, environment), patch.object(
                    publisher, "API", return_value=api
                ), patch.object(publisher, "git", side_effect=local_git):
                    publisher.main()
                self.assertFalse((destination / ".git").exists())
                self.assertTrue((destination / ".nojekyll").exists())
                self.assertEqual((destination / "index.html").read_text(), "main one" if index < 2 else "main two")
                if index in (1, 2):
                    self.assertEqual((destination / "pr-preview/12/index.html").read_text(), "preview twelve")
                if index >= 3:
                    self.assertFalse((destination / "pr-preview/12").exists())
            commits = real_git(remote, "test-token", "rev-list", "--count", "refs/heads/gh-pages")
            self.assertEqual(commits, "4")
            # The retry must redeploy without adding another storage commit.
            self.assertEqual(output_file.read_text().count("publish=true"), 5)


if __name__ == "__main__":
    unittest.main(verbosity=2)
