# Perfumate — Project Progress Log

This is the master chronological log for the Perfumate Dawn theme
customization project. Newest entry at the top. See `docs/README.md` for
the full documentation index.

## Current Status

- **Active phase:** Phase 1 — Brand Foundations (complete), moving to
  Phase 2 — Metafields & Product Badges
- **Theme base:** Shopify Dawn v15.5.0 (official `Shopify/dawn` repo, no fork)
- **Remote:** `https://github.com/perfuminati77105/perfuminati.git`
- **Open blockers:**
  - Dev/staging Shopify store domain not yet provided by user. `shopify
    theme dev` (live preview) and any Shopify Admin work (creating
    metafield definitions, automated collections) are blocked until this
    is supplied. See
    [docs/2026-08-10-store-connection.md](docs/2026-08-10-store-connection.md).
- **Do not deploy:** No work in this project may be pushed to any live
  Shopify theme. All work is local-only / dev-store preview only. (Pushing
  source code to the private GitHub repo above is separate from deploying
  to a Shopify store, and does not touch any live theme.)

---

## [2026-08-10 21:30] Phase 1: Brand Foundations

### What changed & why
Applied the Perfumate brand identity (color palette, typography, section
spacing, button styling) entirely through Dawn's existing settings system —
no new architecture, minimal CSS footprint. Full detail, including the
color-scheme-to-role mapping table, is in
[docs/2026-08-10-theme-work.md](docs/2026-08-10-theme-work.md).

### Files modified
- `config/settings_data.json` — re-themed all 5 color schemes to a warm
  ivory / espresso-charcoal / champagne-gold palette; switched
  `type_header_font` to `playfair_display_n4`, `type_body_font` to
  `jost_n4`; `page_width` 1200 → 1400; `spacing_sections` 0 → 16.
- `assets/base.css` — uppercase + widened letter-spacing on the shared
  `.button` / `.button-label` rule.

### Sections/components created
None (settings + shared CSS rule only).

### Metafields created
None (Phase 2).

### Liquid/CSS/JS changes
One CSS change (button typography), no Liquid/JS changes — colors/fonts
flow through Dawn's existing `layout/theme.liquid` CSS-custom-property
generation automatically.

### Theme settings added
None — reused existing settings keys.

### Responsive changes
None specific to this phase.

### Testing performed
- `node -e "JSON.parse(...)"` sanity check on `settings_data.json`.
- `npx shopify theme check`: 171 files, **0 errors, 8 warnings** — identical
  to the Phase 0 baseline, no regressions.
- Visual/responsive testing deferred to Phase 10 (no live store yet).

### Issues encountered & fixes applied
None.

### Shopify CLI commands used
`npx shopify theme check`

### Important decisions
- Re-themed existing `scheme-1`…`scheme-5` slots in place rather than
  adding new schemes, so every existing reference to those scheme IDs
  (card backgrounds, sale/sold-out badge colors, cart drawer, password
  page) automatically inherits the new palette.

### Assumptions
- Font IDs `playfair_display_n4` / `jost_n4` are believed valid Shopify
  font-picker entries but are **unverified against a live store** — static
  `theme check` can't validate against Shopify's font service. Flagged for
  a one-click confirm/fix in the Theme Editor once Phase 10 starts.

### Pending work
- Confirm font rendering live once store access exists.
- Choose Phase 2 badge colors to stay visually distinct from the
  gold (sale) / espresso (sold-out) badges this palette already implies.

---

## [2026-08-10 21:00] Phase 0: Project Scaffolding & Baseline

### What changed & why
Initialized the Perfumate project by importing the official Dawn v15.5.0
theme as a clean git baseline, installing Shopify CLI, and establishing the
documentation structure required to track every subsequent change.

### Files modified
- Entire repository seeded from `Shopify/dawn` tag `v15.5.0` (375 files).
- `package.json`, `package-lock.json` — added via `npm install` (Shopify CLI).
- `docs/README.md`, `docs/2026-08-10-project-setup.md`,
  `docs/2026-08-10-store-connection.md`, `PROJECT_PROGRESS.md` — created.

### Sections/components created
None yet (untouched Dawn baseline).

### Metafields created
None yet. Planned for Phase 2 — see
[docs/2026-08-10-metafields.md](docs/2026-08-10-metafields.md).

### Liquid/CSS/JS changes
None — baseline import only.

### Theme settings added
None.

### Responsive changes
None.

### Testing performed
- `npx shopify theme check` run against the untouched baseline:
  **171 files inspected, 0 errors, 8 warnings** (all pre-existing in stock
  Dawn — `UnusedAssign`, `VariableName`, `UndefinedObject`, `OrphanedSnippet`
  across `sections/main-collection-product-grid.liquid`,
  `sections/main-product.liquid`, `sections/main-search.liquid`,
  `snippets/quick-order-product-row.liquid`, and others). This 8-warning
  baseline is our reference point — later phases should not add new
  warnings/errors beyond this.

### Issues encountered & fixes applied
- `git clone` initially left the working tree in a detached HEAD state (git
  behavior when cloning a tag). Attempted to reset git history via
  `rm -rf .git` which failed partway on Windows due to file locks
  (`Device or resource busy`), leaving a corrupted `.git` directory. Fixed
  by removing the remnant directory (`rm -rf .git` succeeded on retry) and
  running `git init -b main` fresh. Theme source files on disk were
  unaffected throughout — only the `.git` metadata directory was involved.
- Git required a local commit identity (no global config existed). Set
  **repository-local** `user.name`/`user.email` (not global) — did not
  touch global git config per project safety rules.

### Shopify CLI commands used
- `git clone --branch v15.5.0 --depth 1 https://github.com/Shopify/dawn.git .`
- `git init -b main`
- `npm install --save-dev @shopify/cli`
- `npx shopify version` → `4.6.1`
- `npx shopify theme check`

### Important decisions
- Confirmed with user: no existing Dawn fork to use — base is official
  `Shopify/dawn`, latest tagged release (v15.5.0) at time of project start.
- Confirmed with user: badge stacking rule — Sold Out is exclusive
  (suppresses all other badges); otherwise show at most 2 badges, priority
  New (Latest) > Best Seller > Trending. This governs Phase 2 design.
- `shopify theme check` adopted as the primary automated correctness gate
  for all phases until live store preview is available.

### Assumptions
- Git history was reset to a single clean baseline commit rather than
  preserving Dawn's full upstream commit history, for a simpler, purpose-
  built repo. If future Dawn upstream merges are wanted, we can add
  `Shopify/dawn` as a git remote later — not done yet since it wasn't
  requested.

### Pending work
- Phases 1–10 per the approved implementation plan.
- Store domain still needed from user for Phase 10 (live preview) and any
  Shopify Admin-side setup (metafield definitions, automated collections).

### Limitations
- No live Shopify store connected yet — nothing in this project has been
  previewed in an actual browser/theme editor. All verification through
  Phase 9 is static (code review + `shopify theme check`).
