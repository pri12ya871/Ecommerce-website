// Shared frontend helpers.

export const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="#eef0f6"/><g fill="#b7bdd1"><circle cx="300" cy="255" r="55"/><path d="M170 430c18-70 66-105 130-105s112 35 130 105z"/></g><text x="300" y="520" font-family="Arial" font-size="28" fill="#9aa1b8" text-anchor="middle">Image unavailable</text></svg>`
  );

// Product images can be full CDN URLs (seed catalog) or bare filenames
// stored under /public/images (uploads from the admin/seller flows).
export const imgSrc = (image) => {
  if (!image) return PLACEHOLDER_IMG;
  return image.startsWith('http') || image.startsWith('data:')
    ? image
    : `/images/${image}`;
};

export const onImgError = (e) => {
  if (e.currentTarget.src !== PLACEHOLDER_IMG) {
    e.currentTarget.src = PLACEHOLDER_IMG;
  }
};

export const formatPrice = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return '$0';
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
};

export const discountOf = (product) => {
  if (product.discount) return Math.round(product.discount);
  if (product.oldPrice && product.oldPrice > product.price) {
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  }
  return 0;
};
