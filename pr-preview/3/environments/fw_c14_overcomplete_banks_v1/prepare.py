#!/usr/bin/env python3
"""Restore four pinned assets from a local archive and stage verifier inputs."""

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import tarfile
import tempfile


ROOT = Path(__file__).resolve().parent
ASSET_PATHS = {
    "environment/files/software/openroad-runtime.tgz",
    "environment/files/technology/sky130_fd_sc_hd__tt_025C_1v80.lib",
    "environment/files/technology/sky130_fd_sc_hd_merged.lef",
    "environment/files/technology/sky130_fd_sc_hd.tlef",
}


def digest(path):
    result = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            result.update(chunk)
    return result.hexdigest()


def check_file(path, expected):
    if not path.is_file() or path.is_symlink():
        raise ValueError(f"Missing regular file: {path}")
    if path.stat().st_size != expected["size"]:
        raise ValueError(f"Size mismatch: {path}")
    if digest(path) != expected["sha256"]:
        raise ValueError(f"SHA-256 mismatch: {path}")


def load_manifest():
    manifest = json.loads((ROOT / "assets.json").read_text())
    files = manifest["files"]
    if len(files) != len(ASSET_PATHS) or {x["path"] for x in files} != ASSET_PATHS:
        raise ValueError("assets.json must describe exactly the four allowed assets")
    for entry in files:
        if entry["archive_member"] != entry["path"]:
            raise ValueError(f"Unexpected archive member: {entry['archive_member']}")
    for entry in [manifest["archive"], *files]:
        checksum = entry["sha256"]
        if not isinstance(entry["size"], int) or entry["size"] < 0:
            raise ValueError("Invalid asset size in assets.json")
        if len(checksum) != 64 or any(c not in "0123456789abcdef" for c in checksum):
            raise ValueError("Invalid SHA-256 in assets.json")
    return manifest


def reject_symlinks(path):
    """Keep generated writes inside this example, even in a modified checkout."""
    for candidate in [path, *path.parents]:
        if candidate == ROOT:
            break
        if candidate.is_symlink():
            raise ValueError(f"Symlink is not supported: {candidate}")


def file_map(directory):
    if not directory.is_dir():
        raise ValueError(f"Missing directory: {directory}")
    reject_symlinks(directory)
    result = {}
    for path in sorted(directory.rglob("*")):
        reject_symlinks(path)
        if path.is_file():
            result[str(path.relative_to(directory))] = (path.stat().st_size, digest(path))
    return result


def check_prepared(manifest):
    for entry in manifest["files"]:
        path = ROOT / entry["path"]
        reject_symlinks(path)
        check_file(path, entry)
    public = file_map(ROOT / "environment/files")
    verifier = file_map(ROOT / "tests/public")
    if public != verifier:
        changed = sorted(key for key in public.keys() | verifier.keys()
                         if public.get(key) != verifier.get(key))
        raise ValueError("Verifier inputs differ; run --archive again: " + ", ".join(changed))
    print(f"OK: 4 assets verified; {len(public)} public files match tests/public.")


def prepare(archive_path, manifest):
    check_file(archive_path, manifest["archive"])
    public = ROOT / "environment/files"
    verifier = ROOT / "tests/public"
    file_map(public)
    reject_symlinks(verifier)
    for entry in manifest["files"]:
        reject_symlinks(ROOT / entry["path"])

    with tempfile.TemporaryDirectory(prefix=".prepare-", dir=ROOT) as temporary:
        stage = Path(temporary)
        wanted = {entry["archive_member"]: entry for entry in manifest["files"]}
        found = set()
        with tarfile.open(archive_path, "r:gz") as archive:
            for member in archive:
                if member.name not in wanted:
                    continue
                if member.name in found:
                    raise ValueError(f"Duplicate archive member: {member.name}")
                entry = wanted[member.name]
                if not member.isfile() or member.size != entry["size"]:
                    raise ValueError(f"Invalid asset type or size: {member.name}")
                destination = stage / entry["path"]
                destination.parent.mkdir(parents=True, exist_ok=True)
                with archive.extractfile(member) as source, destination.open("wb") as target:
                    shutil.copyfileobj(source, target)
                check_file(destination, entry)
                found.add(member.name)
        missing = wanted.keys() - found
        if missing:
            raise ValueError("Missing archive members: " + ", ".join(sorted(missing)))

        # Build the verifier copy only after all archived assets have passed checks.
        staged_public = stage / "verifier-public"
        shutil.copytree(public, staged_public)
        for entry in manifest["files"]:
            relative = Path(entry["path"]).relative_to("environment/files")
            destination = staged_public / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(stage / entry["path"], destination)

        for entry in manifest["files"]:
            destination = ROOT / entry["path"]
            destination.parent.mkdir(parents=True, exist_ok=True)
            (stage / entry["path"]).replace(destination)
        if verifier.exists():
            shutil.rmtree(verifier)
        staged_public.replace(verifier)
    check_prepared(manifest)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--archive", type=Path, help="original local fw_c14_overcomplete_banks_v1.tgz")
    mode.add_argument("--check", action="store_true", help="check restored assets and verifier inputs without writing")
    args = parser.parse_args()
    try:
        manifest = load_manifest()
        if args.check:
            check_prepared(manifest)
        else:
            prepare(args.archive.expanduser(), manifest)
    except (OSError, ValueError, KeyError, TypeError, tarfile.TarError, EOFError) as error:
        parser.exit(1, f"ERROR: {error}\n")


if __name__ == "__main__":
    main()
