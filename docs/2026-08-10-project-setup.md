# 2026-08-10 — Project Setup

## Goal
Stand up the Perfumate project: a clean local copy of Shopify Dawn as the
base theme, version-controlled, with Shopify CLI available, ready for
incremental customization.

## Base theme
- Source: official [`Shopify/dawn`](https://github.com/Shopify/dawn) repo.
- Version: **v15.5.0** (latest tagged release at project start).
- No custom fork — confirmed with the project owner that no prior fork
  exists.

## Steps performed

1. **Clone Dawn at the pinned tag:**
   ```sh
   git clone --branch v15.5.0 --depth 1 https://github.com/Shopify/dawn.git .
   ```
   A shallow, single-tag clone was used since we don't need Dawn's full
   commit history in this repo.

2. **Reset to a clean local git history.** The clone leaves the working
   tree in a detached-HEAD state (expected when cloning a tag). Re-initialized
   git locally (`git init -b main`) so the project has its own single-commit
   baseline ("Import Dawn v15.5.0 as base") rather than carrying Dawn's
   upstream history. See the Issues section below for a snag hit here.

3. **Set local (repo-only) git identity** — `user.name` / `user.email` were
   not configured on this machine. Set via repo-local `git config` (not
   `--global`), so this doesn't affect any other project on the machine.

4. **Installed Shopify CLI** as a project dev dependency rather than a
   global install, so the CLI version is pinned/reproducible per-project:
   ```sh
   npm install --save-dev @shopify/cli
   npx shopify version   # 4.6.1
   ```

5. **Verified `.gitignore`** — Dawn's own repo already ships a `.gitignore`
   covering `.shopify`, `node_modules`, OS cruft (`.DS_Store`, `Thumbs.db`),
   and `*.zip`. No changes needed.

6. **Established the baseline correctness gate:**
   ```sh
   npx shopify theme check
   ```
   Result: 171 files inspected, **0 errors**, 8 warnings — all pre-existing
   in stock Dawn (not introduced by us). This is the reference point every
   later phase is checked against.

## Issue encountered: corrupted `.git` on Windows

Attempting `rm -rf .git` (to drop the detached-HEAD clone history before
re-initializing) failed partway through with `Device or resource busy` on
two files (`FETCH_HEAD`, a pack tmp file) — a Windows file-locking quirk,
not a data problem. This left a partial `.git` directory (`git status`
then failed with "not a git repository"). Diagnosed by listing what
remained in `.git` (just `FETCH_HEAD` and `objects/`), confirmed the
*theme source files on disk* were untouched (`ls` showed all 375 files
present, `sections/` had 55 files, `snippets/` had 39), then retried
`rm -rf .git` — it succeeded on the second attempt once the lock cleared —
and ran `git init -b main` fresh. No data was lost; only git metadata was
briefly in a broken state.

## Commands used (full list)

```sh
git clone --branch v15.5.0 --depth 1 https://github.com/Shopify/dawn.git .
git checkout -b main
rm -rf .git            # failed first attempt (Windows file lock)
rm -rf .git            # succeeded on retry
git init -b main
git config user.email "jason.bourne@byteful.com.au"
git config user.name "Perfumate Dev"
git add -A
git commit -m "Import Dawn v15.5.0 as base ..."
npm install --save-dev @shopify/cli
npx shopify version
npx shopify theme check
```

## Assumptions
- Single clean baseline commit was chosen over preserving Dawn's full
  upstream git history. If pulling future Dawn releases via `git merge`/
  `git remote` is wanted later, we can add `Shopify/dawn` as a remote at
  that time — not set up now since it wasn't requested.
- Local git identity (`Perfumate Dev` / the project owner's email) is a
  placeholder for commit authorship; change via `git config user.name`/
  `user.email` in this repo if a different identity is preferred.

## Pending
- Store domain needed to move Phase 10 (live preview) and any Admin-side
  work forward — see
  [2026-08-10-store-connection.md](2026-08-10-store-connection.md).
