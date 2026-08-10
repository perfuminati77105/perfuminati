# Perfumate — Project Progress Log

This is the master chronological log for the Perfumate Dawn theme
customization project. Newest entry at the top. See `docs/README.md` for
the full documentation index.

## Current Status

- **Active phase:** Phase 4 — Homepage (complete), moving to Phase 5 —
  Product Page
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

## [2026-08-10 22:45] Phase 3: Product Card Polish

### What changed & why
Targeted CSS-only polish of Dawn's shared product card
(`assets/component-card.css`), building on the badge system from Phase 2.
No Liquid changes — all improvements are visual refinements to existing
markup/classes.

### Files modified
- `assets/component-card.css`

### What changed, specifically
1. **Hover-image crossfade:** replaced the plain `ease` transition with an
   explicit cubic-bezier easing curve, increased hover scale slightly
   (1.03 → 1.04), and — the actual bug fix — added a matching opacity
   transition to the *first* image (previously only the second/incoming
   image had a transition, so the primary image snapped to `opacity: 0`
   instantly on hover instead of fading, and would snap back instantly on
   mouse-leave too). Now both images crossfade symmetrically in both
   directions.
2. **Quick add hover-reveal (desktop only, ≥990px):** the quick-add button
   now fades in (opacity + subtle translateY) on card hover or keyboard
   focus, CSS-only, no JS. Scoped to `.card:not(.card--horizontal)` so it
   doesn't affect horizontal card layouts (e.g. the PDP's related-items
   row). Always fully visible below 990px, where hover isn't a reliable
   input method (touch devices) — this avoids hiding the primary
   conversion action on mobile.
3. **Sale price accent:** the discounted price on product cards now uses
   the champagne-gold accent (`#c7a76c`, matching color scheme 5) instead
   of the default foreground color, so it stands out visually from the
   struck-through compare-at price. Scoped to `.card-information` only
   (not the shared `price.liquid` component globally), to avoid affecting
   price display in other contexts (PDP, cart) that may sit on different
   color schemes.

### Sections/components created
None (existing component CSS file modified).

### Metafields created
None.

### Liquid/CSS/JS changes
CSS only — no Liquid or JS files touched this phase.

### Theme settings added
None.

### Responsive changes
Quick-add hover-reveal is explicitly breakpoint-gated (≥990px only) so
mobile/tablet behavior is unchanged (always visible, no hover dependency).

### Testing performed
- `npx shopify theme check`: **172 files inspected, 0 errors, 8 warnings**
  — same pre-existing baseline, no regressions (expected, since only CSS
  changed and theme check doesn't lint CSS).
- Visual/interaction testing (hover crossfade smoothness, quick-add reveal
  timing, keyboard focus behavior, gold price contrast) **not yet
  possible** — no live store. Deferred to Phase 9 (static CSS review) and
  Phase 10 (live).

### Issues encountered & fixes applied
Identified and fixed a latent Dawn CSS asymmetry while polishing the
hover effect: the primary product image had no opacity transition, only
the secondary (hover) image did, causing an abrupt (non-animated) snap
when the image swapped back on mouse-leave. Not a regression we
introduced — pre-existing in stock Dawn — but worth flagging since it's a
concrete bug fix bundled into this phase's polish pass.

### Shopify CLI commands used
`npx shopify theme check`

### Important decisions
- Chose a CSS-only (no JS) hover-reveal for quick add, using
  `:hover`/`:focus-within`, to avoid adding JS complexity for a purely
  visual affordance, and because it degrades gracefully (always-visible)
  below the breakpoint where hover isn't available.
- Hardcoded the gold hex (`#c7a76c`) directly in CSS for the sale-price
  accent rather than adding a new theme setting for it — this is a single
  small stylistic accent, not a merchant-configurable badge, and it
  mirrors the same gold already defined in `config/settings_data.json`
  scheme-5. Flagged with a code comment for future maintainers so it stays
  in sync if the palette changes.

### Assumptions
None beyond what's already tracked in earlier phases (font IDs, live
visual verification pending).

### Pending work
Visual/interaction QA once live preview is available (Phase 10).

### Limitations
None new this phase.

---

## [2026-08-10 23:15] Phase 4: Homepage

### What changed & why
Rebuilt `templates/index.json` from Dawn's stock single hero +
featured-collection into a full premium homepage narrative, using only
existing Dawn section/block types composed through JSON — no new sections
or Liquid code. Section schemas (setting ids, valid enum values, block
types) were confirmed by reading each section's `{% schema %}` block
directly before writing the JSON, to avoid guessing wrong ids/values that
`shopify theme check` or the customizer would silently reject.

### Files modified
- `templates/index.json` (complete rewrite)

### Homepage structure (8 sections, in order)
1. **Hero** (`image-banner`) — full-bleed image with dark overlay
   (`image_overlay_opacity: 40`, `color_scheme: scheme-4`), headline "A
   Signature Scent Awaits", supporting text, primary CTA ("Shop All
   Fragrances" → `shopify://collections/all`, always valid) and secondary
   CTA ("Explore Our Story", link left blank for the merchant to set).
2. **Trending Now** (`featured-collection`) — `quick_add: standard`,
   `show_secondary_image: true`, portrait image ratio, scheme-1.
3. **New Arrivals** (`featured-collection`) — same structure, scheme-2.
4. **Best Sellers** (`featured-collection`) — same structure, scheme-1.
5. **Discovery collage** (`collage`) — mixed product/collection/image
   promo tile, scheme-2.
6. **Brand story** (`image-with-text`) — "Our Story" caption, "Crafted
   With Intention" heading, brand copy, "Learn More" button, scheme-2.
7. **Shop by Collection** (`collection-list`) — 3 collection tiles, scheme-1.
8. **Newsletter** (`newsletter`) — dark scheme-3 close, email signup.

Color schemes alternate through the page (dark hero → light → beige →
light → beige → beige → light → dark newsletter) for visual rhythm rather
than a flat single background throughout.

### Sections/components created
None — composition only, using Dawn's existing section types.

### Metafields created
None this phase (see Phase 2).

### Liquid/CSS/JS changes
None — JSON template only.

### Theme settings added
None.

### Responsive changes
None specific to this phase; relies on each section's existing responsive
CSS (`columns_mobile` settings explicitly set on grid sections to keep
mobile layouts sane — e.g. `"2"` for the product grids, `"1"` for
collection-list).

### Testing performed
- `node -e "JSON.parse(...)"` — valid JSON.
- `npx shopify theme check`: **172 files inspected, 0 errors, 8 warnings**
  — identical pre-existing baseline, no regressions or schema-validation
  errors from the new template.
- Visual verification (image placeholders, section flow, spacing rhythm,
  mobile stacking) **not yet possible** — no live store/theme editor
  access. Deferred to Phase 10.

### Issues encountered & fixes applied
None — schemas were confirmed against source before writing JSON,
avoiding trial-and-error.

### Shopify CLI commands used
`npx shopify theme check`

### Important decisions
- The three featured-collection sections (Trending/New/Best Sellers) point
  at the `all` collection as a working, non-blank default. **This is a
  placeholder** — per `docs/2026-08-10-metafields.md`, the intended
  end-state is 3 automated collections keyed on the `custom.trending` /
  `custom.latest` / `custom.best_seller` metafields, which the merchant
  (or a future session, once store access exists) should create and then
  repoint these sections at.
- The collage and collection-list sections deliberately leave their
  product/collection pickers unset (Dawn's normal "merchant fills this in
  via the customizer" pattern) rather than guessing placeholder content,
  per the "don't hardcode content that should be manageable through
  Shopify" requirement.
- Chose `image-banner` over `slideshow` for the hero specifically because
  it supports 2 buttons (primary + secondary CTA) per the schema research,
  while `slideshow`'s slide block only supports 1 button per slide.

### Assumptions
- Hero and brand-story images are unset (Dawn shows its placeholder
  graphic) since no real product/brand photography exists yet — expected
  to be uploaded by the merchant via the Theme Editor.

### Pending work
- Once store access exists: create the 3 automated collections (Phase 2
  dependency) and repoint the homepage's featured-collection sections at
  them instead of `all`.
- Assign real collections to the collage and collection-list blocks.
- Visual QA in Phase 10.

### Limitations
Cannot verify actual visual layout/rhythm until live preview is available.

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
