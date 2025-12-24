// Utility functions

import { type ClassValue, clsx } from "clsx";

/**
 * Merge class names (simplified version without tailwind-merge)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format number with locale
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("it-IT").format(num);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate embed URL for Sketchfab model
 */
export function getSketchfabEmbedUrl(
  modelId: string,
  options: {
    autostart?: boolean;
    autospin?: boolean;
    ui_stop?: boolean;
  } = {}
): string {
  const params = new URLSearchParams();

  if (options.autostart !== false) {
    params.set("autostart", "1");
  }
  if (options.autospin !== false) {
    params.set("autospin", "1");
  }
  if (options.ui_stop) {
    params.set("ui_stop", "0");
  }

  const queryString = params.toString();
  return `https://sketchfab.com/models/${modelId}/embed${queryString ? `?${queryString}` : ""}`;
}

/**
 * Get thumbnail URL from model
 */
export function getModelThumbnail(model: {
  thumbnail?: { url: string };
  thumbnails?: { images: Array<{ url: string; width: number }> };
}): string | null {
  // Try direct thumbnail first
  if (model.thumbnail?.url) {
    return model.thumbnail.url;
  }

  // Try thumbnails array
  if (model.thumbnails?.images?.length) {
    // Get medium-sized thumbnail
    const sorted = [...model.thumbnails.images].sort(
      (a, b) => a.width - b.width
    );
    const medium = sorted[Math.floor(sorted.length / 2)];
    return medium?.url || sorted[0]?.url || null;
  }

  return null;
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
