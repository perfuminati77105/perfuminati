# 2026-08-10 — Product Badge Metafields

## Status
**Definitions created (2026-08-14)** via Admin API on the `custom`
namespace: `trending`, `latest`, `best_seller` (all Boolean, Product-scoped).
Demo values were set on three real products to verify the badge stack
end-to-end (Amber Leather -> latest, Starry Times -> best_seller, Ambush ->
trending). Also fixed a related bug the same day: `is_on_sale` was
comparing `product.compare_at_price` (a product-wide aggregate across all
variants) against `product.price`, which showed a Sale badge even when the
default/first-available variant itself had no discount (e.g. a product
whose 50ml variant was discounted but whose default 15ml variant wasn't).
It now compares `product.selected_or_first_available_variant`'s own price
and compare_at_price, matching what the price snippet actually displays.

## Metafield definitions to create

In Shopify Admin: **Settings > Custom data > Products > Add definition**,
create three definitions, all in the `custom` namespace:

| Name | Namespace.key | Type | Notes |
|---|---|---|---|
| Trending | `custom.trending` | Boolean | Merchant toggles per product |
| Latest (New) | `custom.latest` | Boolean | Merchant toggles per product |
| Best Seller | `custom.best_seller` | Boolean | Merchant toggles per product |

**Sold Out is intentionally NOT a metafield** — it's derived automatically
from `product.available` (Shopify's real inventory/variant availability),
per the original requirement that sold-out status must be automatic, not
merchant-toggled.

## Badge set & stacking rule (confirmed with project owner, 2026-08-10)

Badges: **Trending**, **New** (from the `latest` metafield), **Best
Seller**, **Sold Out** — plus Dawn's existing **Sale** badge (automatic,
based on `compare_at_price > price`), which this system also absorbs into
the same stack rather than leaving as a separate, differently-positioned
badge.

**Note on visual style:** badges are text-only (e.g. "Trending", "New",
"Best Seller", "Sold Out") — no emoji icons. The original spec listed
🔥/✨/⭐ as illustrative labels, but the project owner asked to drop emoji
from the actual implementation for a cleaner, more premium look.

Rule, implemented in `snippets/product-badges.liquid`:
1. **Sold Out is exclusive.** If `product.available == false`, only the
   Sold Out badge renders; every other badge (including Sale) is
   suppressed.
2. Otherwise, show **at most 2 badges**, chosen in this priority order:
   **New > Best Seller > Trending > Sale.**

The "at most 2, priority New > Best Seller > Trending" portion was
explicitly confirmed with the project owner. **Extension made by this
implementation** (documented here as a decision, not separately
re-confirmed): Dawn's existing Sale badge was folded into the same
priority list at the end, rather than left as an unbounded separate badge,
so a product can never show more than 2 badges total regardless of how
many conditions are true. If this extension isn't wanted, it's a one-line
change in `snippets/product-badges.liquid` (move the `show_sale` block
outside the `shown_count < 2` cap).

## Where badges render

`snippets/product-badges.liquid` is the single source of truth, called
from three places:
- `snippets/card-product.liquid` — both of Dawn's two card badge slots
  (the "standard, no media" card layout and the "media/card style"
  layout), which automatically covers every grid that renders product
  cards: homepage featured collections, collection pages, search results,
  related/recommended products, collage sections, and the PDP's own
  "complementary products" card row.
- `sections/main-product.liquid` — the product page's `title` block, so
  badges appear above the product name on the PDP itself.

See `docs/architecture.md` for the full call-site trace and
`docs/2026-08-10-theme-work.md` (Phase 2 entry in `PROJECT_PROGRESS.md`)
for the CSS/settings changes that support this.

## Color schemes used by each badge

Configurable in Theme Editor under **Theme settings > Badges** once a
store is connected:

| Badge | Setting | Default scheme | Look |
|---|---|---|---|
| Sold Out | `sold_out_badge_color_scheme` | scheme-3 | Espresso-dark, ivory text (unchanged Dawn default location, new palette) |
| New / Latest | `latest_badge_color_scheme` (new) | scheme-5 | Champagne gold |
| Best Seller | `best_seller_badge_color_scheme` (new) | scheme-1 | Ivory pill, espresso text |
| Trending | `trending_badge_color_scheme` (new) | scheme-3 | Espresso-dark (safe: never co-renders with Sold Out, which shares this scheme) |
| Sale | `sale_badge_color_scheme` | scheme-4 | Near-black (unchanged Dawn default location, new palette) |

## Testing checklist for once metafield definitions exist

- [ ] Set `custom.latest = true` on a test product → confirm "New" badge
      appears on its card and PDP.
- [ ] Set `custom.best_seller = true` on the same product → confirm both
      "New" and "Best Seller" badges show (2-badge cap reached).
- [ ] Also set `custom.trending = true` on that product → confirm
      "Trending" does NOT appear (cap already at 2, lower priority).
- [ ] Mark the product's only variant as out of stock → confirm ONLY
      "Sold Out" shows, all other badges disappear.
- [ ] Set a `compare_at_price` above `price` on an in-stock product with no
      metafields set → confirm "Sale" badge shows alone.
- [ ] Confirm badge text and styling match across: homepage, collection
      grid, search results, related products, PDP.

## Bonus: metafield-driven automated collections (Phase 4 dependency)

For the homepage's "Trending" / "New Arrivals" / "Best Sellers" sections
(Phase 4) to stay in sync with these same metafields automatically,
create three **automated collections** in Shopify Admin once the
metafield definitions above exist:
- Settings: **Product metafield** condition, e.g. "Trending" is "true".

This is documented here as a dependency but not yet executed — needs
store access. Until then, Phase 4's homepage sections can point at manual
collections as a placeholder.
