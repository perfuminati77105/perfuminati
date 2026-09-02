/**
 * Strict per-variant image filtering for the product gallery.
 *
 * Shopify Liquid doesn't expose which variants a given image is attached to
 * via dot-notation (only a boolean `attached_to_variant?`), so this reads
 * `product.images | json`, which does include each image's `variant_ids`,
 * from an embedded script tag and uses it to show only the images that
 * belong to the selected variant (any image with no variant_ids at all is
 * treated as a shared/general image and always shown).
 */
(function () {
  function getProductImages(sectionId) {
    const script = document.getElementById(`VariantMediaData-${sectionId}`);
    if (!script) return null;
    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      return null;
    }
  }

  function mediaIdFromDomId(value) {
    const match = /-(\d+)$/.exec(value || '');
    return match ? Number(match[1]) : null;
  }

  function filterGalleryByVariant(sectionId, variantId) {
    const images = getProductImages(sectionId);
    if (!images || !images.length) return;

    const hasVariantSpecificImages = images.some((image) => image.variant_ids && image.variant_ids.length > 0);
    if (!hasVariantSpecificImages) return;

    const imagesById = new Map(images.map((image) => [image.id, image]));
    const isAllowed = (mediaId) => {
      const image = imagesById.get(mediaId);
      if (!image) return true; // not a tracked product image (e.g. a video/model) - always show
      if (!image.variant_ids || image.variant_ids.length === 0) return true; // shared/general image
      return image.variant_ids.includes(variantId);
    };

    const gallery = document.querySelector(`#MediaGallery-${sectionId} .product__media-list`);
    if (!gallery) return;

    let firstVisibleId = null;
    let visibleCount = 0;
    gallery.querySelectorAll('li[data-media-id]').forEach((li) => {
      const mediaId = mediaIdFromDomId(li.dataset.mediaId);
      const show = mediaId === null ? true : isAllowed(mediaId);
      li.hidden = !show;
      if (show) {
        visibleCount += 1;
        if (firstVisibleId === null) firstVisibleId = li.dataset.mediaId;
      }
    });

    const counterTotal = document.querySelector(`#MediaGallery-${sectionId} .slider-counter--total`);
    if (counterTotal) counterTotal.textContent = String(visibleCount);
    const counterCurrent = document.querySelector(`#MediaGallery-${sectionId} .slider-counter--current`);
    if (counterCurrent) counterCurrent.textContent = '1';

    const thumbnailList = document.querySelector(`#GalleryThumbnails-${sectionId} .thumbnail-list`);
    if (thumbnailList) {
      thumbnailList.querySelectorAll('li[data-target]').forEach((li) => {
        const mediaId = mediaIdFromDomId(li.dataset.target);
        li.hidden = mediaId === null ? false : !isAllowed(mediaId);
      });
    }

    const activeSlide = gallery.querySelector('li.is-active');
    if (firstVisibleId && (!activeSlide || activeSlide.hidden)) {
      document.querySelector(`media-gallery#MediaGallery-${sectionId}`)?.setActiveMedia?.(firstVisibleId, true);
    }
  }

  function initialFilterForProductInfo(productInfo) {
    const sectionId = productInfo.dataset.originalSection || productInfo.dataset.section;
    const selectedVariantScript = productInfo.querySelector('[data-selected-variant]');
    if (!selectedVariantScript) return;
    try {
      const variant = JSON.parse(selectedVariantScript.textContent);
      if (variant && variant.id) filterGalleryByVariant(sectionId, variant.id);
    } catch (error) {
      // no-op: nothing to filter without a valid selected variant
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('product-info').forEach(initialFilterForProductInfo);
  });

  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
      const { sectionId, variant } = event.data;
      if (variant) filterGalleryByVariant(sectionId, variant.id);
    });
  }
})();
