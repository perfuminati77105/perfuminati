# Perfumate Theme Architecture (living doc)

This is a non-dated reference that stays up to date as the theme evolves —
unlike the dated docs, edit this in place rather than adding new dated
copies. Last updated: 2026-08-10 (Phase 0, baseline).

## Base
Shopify Dawn v15.5.0, official `Shopify/dawn` repo, no fork.

## Layout
- `layout/theme.liquid` — main theme wrapper (CSS custom properties for
  color schemes/typography are generated here from `settings_data.json`).
- `layout/password.liquid` — password page wrapper.

## Section groups (Dawn's header/footer are NOT hardcoded in theme.liquid)
- `sections/header-group.json` → renders `sections/header.liquid`
- `sections/footer-group.json` → renders `sections/footer.liquid`

## Product card rendering (single shared partial)
`snippets/card-product.liquid` is Dawn's one shared product card, called
from every product-grid context:
- `sections/featured-collection.liquid`
- `sections/main-collection-product-grid.liquid`
- `sections/main-search.liquid`
- `sections/related-products.liquid`
- `sections/collage.liquid`
- `sections/quick-order-list.liquid` (row context)

It accepts a `quick_add` param (`'standard' | 'bulk'`) controlling the
quick-add button behavior, and `show_secondary_image` for the hover-image
swap.

## Existing badge system (pre-Perfumate, stock Dawn)
Dawn v15.5.0 already ships partial badge support — this is what Phase 2
(Metafields & Product Badges) extends rather than replaces:
- `snippets/card-product.liquid` — renders `.badge` / `.card__badge`
  markup for sale/sold-out.
- `snippets/price.liquid` — parallel badge renderer gated by a
  `show_badges` param (`price__badge-sale` / `price__badge-sold-out`).
- `config/settings_schema.json` — `t:settings_schema.badges` settings
  group: color-scheme pickers for sale/sold-out badges, badge position,
  corner radius.

## Product page
- `sections/main-product.liquid` — main PDP section, block-based (media,
  price, variant picker, buy buttons, description, collapsible tabs, etc).
- `snippets/product-media-gallery.liquid`, `product-media.liquid`,
  `product-media-modal.liquid` — gallery.
- `snippets/product-variant-picker.liquid`, `product-variant-options.liquid`,
  `swatch.liquid`, `swatch-input.liquid` — variant selection.
- `snippets/buy-buttons.liquid` — add to cart / dynamic checkout buttons.
- `snippets/product-disclosures.liquid` + `sections/disclosures.liquid` —
  new in v15.5, natural home for "trust elements" (shipping, authenticity,
  returns) rather than a bespoke block type.
- `sections/related-products.liquid` — related/recommended products.

## Settings
- `config/settings_schema.json` — schema (structure, defaults, labels) for
  every theme-editor setting.
- `config/settings_data.json` — the actual current values (color schemes,
  fonts, etc.) — this is what Perfumate's brand values (Phase 1) go into.

## Perfumate additions (filled in as phases land)
- **Phase 1 (done):** Perfumate color palette (warm ivory / espresso-charcoal
  / champagne-gold) re-themed into the existing `scheme-1`…`scheme-5` slots
  in `config/settings_data.json`; `playfair_display_n4` (headings) /
  `jost_n4` (body) font pairing; `page_width` 1400, `spacing_sections` 16;
  uppercase/tracked button labels via `assets/base.css`. See
  [2026-08-10-theme-work.md](2026-08-10-theme-work.md) for full detail
  including the scheme → role mapping table.
- **Phase 2 (done):** `snippets/product-badges.liquid` (new) — single
  source of truth for Sold Out / New / Best Seller / Trending / Sale
  badges, text-only (no emoji, per project owner decision). Reads
  `product.metafields.custom.trending` / `.latest` / `.best_seller`
  defensively (nil-safe). Wired into `snippets/card-product.liquid` (both
  badge slots, covering every card grid site) and
  `sections/main-product.liquid` (`title` block, PDP). New
  `assets/component-badges.css` handles the (up to 2) badge stack layout.
  New settings: `latest_badge_color_scheme` (scheme-5 gold),
  `best_seller_badge_color_scheme` (scheme-1 ivory),
  `trending_badge_color_scheme` (scheme-3 espresso). Full detail, priority
  rule, and metafield setup checklist:
  [2026-08-10-metafields.md](2026-08-10-metafields.md).
  **Deliberate deviation from the original phase plan:** `snippets/price.liquid`'s
  `show_badges` path was left untouched. That mechanism exists to let
  price.js toggle Sale/Sold-Out badges via CSS classes when the *selected
  variant* changes, without a page reload. Our new badges are product-level
  (metafields + `product.available`), not variant-level, so they don't need
  that JS-reactive toggle — they're rendered once, server-side, in the PDP
  `title` block instead, which is simpler and avoids duplicating the
  priority/cap logic in two places.
- **Phase 3 (done):** `assets/component-card.css` polish — smoother
  crossfade+scale on the secondary hover image (explicit cubic-bezier
  easing, symmetric opacity transition on both images instead of only the
  second), quick-add button now fades in on card hover/focus at desktop
  widths (≥990px) via CSS only, always visible below that breakpoint where
  hover isn't available. Card sale price gets a champagne-gold accent
  (`#c7a76c`, matching color scheme 5) to stand out from the struck-through
  compare-at price. No Liquid changes this phase.
- **Phase 4 (done):** `templates/index.json` rebuilt from Dawn's stock
  single hero + featured-collection into a full 8-section homepage
  narrative, entirely via existing Dawn section/block types (no new
  sections created): hero (`image-banner`, 2 CTAs) → Trending Now / New
  Arrivals / Best Sellers (3x `featured-collection`) → discovery promo
  (`collage`) → brand story (`image-with-text`) → Shop by Collection
  (`collection-list`) → newsletter (`newsletter`). All copy/settings are
  customizer-editable; collection pickers point at `all` (trending/new/
  best-seller) or are left unset (collage, collection-list) for the
  merchant to assign — see
  [2026-08-10-metafields.md](2026-08-10-metafields.md) for the automated-
  collection setup that should eventually back the three
  featured-collection sections. Color schemes alternate scheme-4 (hero,
  dark) → 1 → 2 → 1 → 2 → 2 → 1 → scheme-3 (newsletter, dark) for visual
  rhythm.
- **Phase 5 (done):** `templates/product.json` — added 3 `collapsible_tab`
  blocks (Fragrance Notes / Shipping & Delivery / Returns & Exchanges,
  using Dawn's built-in icon set incl. a literal "perfume" and "truck" and
  "return" icon) between the description and share blocks, and changed
  `related-products`' `image_ratio` to `portrait` to match the homepage
  grids. Badges (Phase 2), dynamic checkout (`show_dynamic_checkout:
  true`), and the `disclosures` section were already present/enabled in
  Dawn v15.5's stock `product.json` — no changes needed there. Note: the
  `disclosures` section renders nothing until the merchant configures
  Shopify's native Disclosures feature (Admin-managed `product.metafields.shopify.disclosure`,
  distinct from our Phase 2 `custom.*` badge metafields) — it's a
  self-hiding optional section, not a defect.
- **Phase 6 (done):** `sections/header-group.json` — announcement bar
  restyled to a dark (scheme-4) strip with brand copy ("Complimentary
  shipping on every order") instead of stock "Welcome to our store";
  header logo centered (`logo_position: middle-center`) and made
  permanently sticky (`sticky_header_type: always`) for a boutique feel.
  `sections/footer-group.json` — added 3 footer blocks (previously empty):
  `brand_information` (uses the global `brand_headline`/`brand_description`
  theme settings, now populated in `config/settings_data.json`, previously
  blank), a `link_list` block pointed at Shopify's default auto-created
  `footer` menu handle, and a `text` "About Perfumate" block.
  `assets/base.css` — top-level header nav items (not dropdown/submenu
  items) get the same uppercase/tracked treatment as buttons, via a
  selector scoped to `.header__inline-menu > .list-menu > li` to avoid
  affecting nested dropdown items.
- (Further phases documented here as they land.)
