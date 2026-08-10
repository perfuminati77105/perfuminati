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
- Phase 2: `snippets/product-badges.liquid` (new), badge metafields
  (`custom.trending`, `custom.latest`, `custom.best_seller`), new badge
  color-scheme settings, `assets/component-badges.css` (new). Note:
  scheme-5 (gold) is already used by `sale_badge_color_scheme` and scheme-3
  (espresso) by `sold_out_badge_color_scheme` — new trending/latest/
  best-seller badge colors should stay visually distinct from those.
- (Further phases documented here as they land.)
