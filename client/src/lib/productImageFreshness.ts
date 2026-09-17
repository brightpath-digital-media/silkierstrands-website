import { isProductImageFresh } from "@/lib/priceFreshness.generated";
import localImages from "@/lib/productImages.generated.json";

export type ProductImageLike = {
  asin?: string;
  imageUrl?: string;
  amazonImageUrl?: string;
};

const AMAZON_IMAGE_HOSTS = new Set([
  "m.media-amazon.com",
  "images-na.ssl-images-amazon.com",
]);

export function isAmazonHostedProductImage(url?: string): boolean {
  if (!url) return false;
  try {
    return AMAZON_IMAGE_HOSTS.has(new URL(url).hostname.toLowerCase());
  } catch {
    return false;
  }
}

const LOCAL: Record<string, string> = localImages as Record<string, string>;

/**
 * Product imagery policy (SS-IMAGES-0917, mirrors PF-IMAGES-0917): every product ships a local,
 * manifest-backed copy of its listing image under /images/products/<asin>.jpg (built by
 * scripts/build-product-image-library.mjs). A hotlinked Amazon image is used only when there is no
 * local copy AND the sync for that ASIN is fresh — never as a silent fallback, which left every
 * card on the site imageless whenever the Creators API sync went stale.
 */
export function getLocalProductImage(asin?: string): string | undefined {
  return asin ? LOCAL[asin] : undefined;
}

export function getRenderableProductImage(product?: ProductImageLike): string | undefined {
  const local = getLocalProductImage(product?.asin);
  if (local) return local;
  const candidates = [product?.imageUrl, product?.amazonImageUrl].filter((url): url is string => Boolean(url));
  const siteOwnedImage = candidates.find((url) => !isAmazonHostedProductImage(url));
  if (siteOwnedImage) return siteOwnedImage;
  const amazonImage = candidates.find(isAmazonHostedProductImage);
  return amazonImage && isProductImageFresh(product?.asin) ? amazonImage : undefined;
}
