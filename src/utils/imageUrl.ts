import { urlImageRepo } from "../config/default/misc";

const imageExistsCache = new Map<string, boolean>();

const FALLBACK_IMAGE = "eventImage/0000-000.png";

/**
 * Get the URL for an image, checking if it exists via HTTP.
 * Caches only existing images (retries on failure).
 * Returns placeholder URL with failedimage param if image doesn't exist.
 */
export async function getImageUrl(
  subFolder: string,
  imageName: string,
): Promise<string> {
  const cacheKey = `${subFolder}/${imageName}`;
  const targetUrl = `${urlImageRepo}/${subFolder}/${imageName}`;

  if (imageExistsCache.get(cacheKey) === true) {
    return targetUrl;
  }

  try {
    const res = await fetch(targetUrl, { method: "HEAD" });
    if (res.ok) {
      imageExistsCache.set(cacheKey, true);
      return targetUrl;
    }
  } catch {
    // Network error or other failure
  }

  const fallbackUrl = `${urlImageRepo}/${FALLBACK_IMAGE}?failedimage=${encodeURIComponent(imageName)}`;
  return fallbackUrl;
}
