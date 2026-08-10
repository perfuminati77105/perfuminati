# 2026-08-10 — Store Connection (Live Preview Setup)

## Status: BLOCKED — waiting on store domain

`shopify theme dev` (live local preview against a real Shopify store) and
any Shopify Admin console work (creating metafield definitions, automated
collections, uploading real product/media data) require an authenticated
connection to a Shopify store. This project does not have one connected
yet.

**Nothing in this project has been pushed to, previewed on, or otherwise
touched a live Shopify theme.** All work through Phase 9 of the
implementation plan is local file editing plus static validation
(`shopify theme check`) only.

## What's needed from the store owner

A **development or staging store domain**, e.g. `perfumate-dev.myshopify.com`.
A Shopify Partner dev store (free) is fine and recommended for this kind of
work — it should NOT be the live/production store.

## What happens once a domain is provided

1. Authenticate the Shopify CLI:
   ```sh
   npx shopify auth login
   ```
   This opens an interactive browser OAuth flow — must be run by a human in
   an interactive terminal (cannot be completed from a non-interactive
   agent session).

2. Start local theme development against the store, as an **unpublished
   preview theme** (this never touches the store's live/published theme):
   ```sh
   npx shopify theme dev --store=<your-store>.myshopify.com
   ```
   This serves the local theme files at a local preview URL and hot-reloads
   on file changes — used for Phase 10 (visual/responsive/interactive
   testing) and any earlier ad-hoc visual check the owner wants to run
   sooner.

3. Once satisfied, the store owner (not this agent, unless explicitly
   instructed) decides when/whether to push a theme to the store as a new
   **draft/unpublished theme**:
   ```sh
   npx shopify theme push --unpublished --theme="Perfumate"
   ```
   Publishing (`shopify theme publish`) — making it the live theme — is
   always a manual, explicit, separate decision by the store owner.

## Admin-side setup that also needs store access

Documented in detail in
[2026-08-10-metafields.md](2026-08-10-metafields.md), but noted here since
it's part of "what's blocked":
- Creating the three product metafield definitions
  (`custom.trending`, `custom.latest`, `custom.best_seller`).
- Optionally creating automated collections keyed on those metafields for
  homepage Trending/New/Best Seller sections (Phase 4).

## Pending
Waiting on the store domain from the project owner. This document will be
updated with the actual domain (or a placeholder confirming it's connected)
once supplied, and Phase 10 will proceed at that point.
