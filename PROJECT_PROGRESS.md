# Perfumate — Project Progress Log

This is the master chronological log for the Perfumate Dawn theme
customization project. Newest entry at the top. See `docs/README.md` for
the full documentation index.

## Current Status

- **Active phase:** Phase 2 — Metafields & Product Badges (complete),
  moving to Phase 3 — Product Card Polish
- **Theme base:** Shopify Dawn v15.5.0 (official `Shopify/dawn` repo, no fork)
- **Remote:** `https://github.com/perfuminati77105/perfuminati.git`
  (connected, not yet pushed — pushing paused at user's request; git
  history remains local-only until they say go)
- **Open blockers:**
  - Dev/staging Shopify store domain not yet provided by user. `shopify
    theme dev` (live preview) and any Shopify Admin work (creating
    metafield definitions, automated collections) are blocked until this
    is supplied. See
    [docs/2026-08-10-store-connection.md](docs/2026-08-10-store-connection.md).
  - Metafield definitions (`custom.trending`, `custom.latest`,
    `custom.best_seller`) not yet created in Shopify Admin — needs store
    access. Theme code already reads them defensively in the meantime. See
    [docs/2026-08-10-metafields.md](docs/2026-08-10-metafields.md).
- **Do not deploy:** No work in this project may be pushed to any live
  Shopify theme. All work is local-only / dev-store preview only. (Pushing
  source code to the private GitHub repo above is separate from deploying
  to a Shopify store, and does not touch any live theme.)

---

## [2026-08-10 22:15] Phase 2: Metafields & Product Badges System

### What changed & why
Built the dynamic product badge system — the project's centerpiece
technical feature — as a single reusable snippet driven by 3 boolean
product metafields plus Shopify's native availability/sale data, wired
into every product-card context and the product page. Full detail,
including the confirmed stacking/priority rule and the metafield admin
setup checklist, is in
[docs/2026-08-10-metafields.md](docs/2026-08-10-metafields.md).

### Files modified/created
- `snippets/product-badges.liquid` (new) — single source of truth for all
  badge rendering.
- `assets/component-badges.css` (new) — badge stack layout (column on
  cards, wrapping row on PDP).
- `snippets/card-product.liquid` — both existing badge slots replaced with
  calls to `product-badges.liquid`; simplified the `aria-labelledby`
  wiring on both card title links to always reference the badge element id
  (safe — browsers ignore `aria-labelledby` references to non-existent
  ids, so this works whether or not a badge actually renders).
- `sections/main-product.liquid` — badge render added to the `title`
  block; added `component-badges.css` to the section's stylesheet includes.
- `config/settings_schema.json` — 3 new color-scheme settings in the
  existing `t:settings_schema.badges` group:
  `latest_badge_color_scheme`, `best_seller_badge_color_scheme`,
  `trending_badge_color_scheme`.
- `config/settings_data.json` — default values for the 3 new settings.
- `locales/en.default.json` — new `products.product.trending` / `.latest`
  / `.best_seller` keys.
- `locales/en.default.schema.json` — labels for the 3 new theme settings.

### Sections/components created
`snippets/product-badges.liquid`, `assets/component-badges.css`.

### Metafields created
**None yet in Shopify Admin** (needs store access — see blockers above).
Specified and documented: `custom.trending`, `custom.latest`,
`custom.best_seller`, all Boolean. Theme code reads them defensively
(nil-safe) so the theme works correctly whether or not the definitions
exist yet.

### Liquid/CSS/JS changes
Liquid: 1 new snippet, 2 files wired to call it (see above). CSS: 1 new
file. No JavaScript changes — badges are server-rendered per page load,
deliberately not wired into the variant-reactive JS badge mechanism in
`snippets/price.liquid` (see `docs/architecture.md` for the reasoning).

### Theme settings added
`latest_badge_color_scheme`, `best_seller_badge_color_scheme`,
`trending_badge_color_scheme` (all `color_scheme` type, in the existing
Badges settings group).

### Responsive changes
Badge stack CSS uses flexbox with `flex-wrap`/`text-overflow: ellipsis`
safeguards to avoid overflow on narrow cards; full breakpoint visual
verification deferred to Phase 9 (static review) and Phase 10 (live).

### Testing performed
- `node -e "JSON.parse(...)"` on all 4 edited JSON files — valid.
- `npx shopify theme check`: **172 files inspected, 0 errors, 8 warnings**
  — same 8 pre-existing warnings as the Phase 0 baseline, no regressions,
  and the new `product-badges.liquid` snippet itself is fully clean.
- Manual call-site trace (see `docs/2026-08-10-metafields.md`): confirmed
  `card-product.liquid` badge rendering covers every grid — homepage
  featured collections, collection pages, search results, related
  products, collage sections, and the PDP's own complementary-products row
  — since they all render through the one shared snippet.
- Live/visual badge testing (metafields toggled on real products, sold-out
  state, stacking appearance) blocked on store access — checklist ready in
  the metafields doc for Phase 10.

### Issues encountered & fixes applied
None.

### Shopify CLI commands used
`npx shopify theme check`

### Important decisions
- **No emoji in badges.** The original spec listed 🔥/✨/⭐ as illustrative
  labels; the project owner asked mid-session to drop emoji from the
  actual badges for a cleaner, more premium look. Badges are text-only
  ("Trending", "New", "Best Seller", "Sold Out").
- Folded Dawn's existing Sale badge into the same priority-capped list
  (New > Best Seller > Trending > Sale, max 2 shown) rather than leaving
  it as a separate, uncapped badge — see the metafields doc for the
  reasoning and how to revert this specific choice if unwanted.
- Left `snippets/price.liquid`'s `show_badges` mechanism untouched — it's
  a variant-reactive JS-driven toggle for Sale/Sold-Out that doesn't apply
  to our product-level metafield badges. See `docs/architecture.md`.
- Chose `aria-labelledby` to always reference the badge element id rather
  than conditionally including it, since unmatched id references are
  silently ignored by browsers/assistive tech — simpler and avoids
  duplicating the badge-visibility logic in the calling template.

### Assumptions
- Badge color scheme assignments (gold for New, ivory for Best Seller,
  espresso for Trending) were chosen to avoid two badges looking identical
  when stacked together — visual confirmation pending Phase 10.

### Pending work
- Create the 3 metafield definitions in Shopify Admin once store access
  exists (checklist in the metafields doc).
- Run the metafields doc's testing checklist against real products once
  definitions exist.
- Phase 4 dependency: 3 automated collections (Trending/New/Best Sellers)
  keyed on these metafields, for the homepage — documented, not yet built.

### Limitations
- Cannot verify actual visual badge appearance (stacking, color contrast,
  responsive wrapping) until live preview is available.

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
