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
 * Generate embed URL for Sketchfab model (white-label)
 */
export function getSketchfabEmbedUrl(
  modelId: string,
  options: {
    autostart?: boolean;
    autospin?: number; // 0 = off, 0.1 = very slow, 1 = normal
    whiteLabel?: boolean;
  } = {}
): string {
  const params = new URLSearchParams();

  // Autostart
  params.set("autostart", options.autostart !== false ? "1" : "0");

  // Autospin - default to very slow (0.1) or off (0)
  params.set("autospin", String(options.autospin ?? 0.1));

  // White-label: hide all Sketchfab UI/branding
  if (options.whiteLabel !== false) {
    params.set("ui_controls", "0");
    params.set("ui_infos", "0");
    params.set("ui_inspector", "0");
    params.set("ui_stop", "0");
    params.set("ui_help", "0");
    params.set("ui_settings", "0");
    params.set("ui_vr", "0");
    params.set("ui_fullscreen", "0");
    params.set("ui_annotations", "0");
    params.set("ui_watermark", "0");
    params.set("ui_watermark_link", "0");
    params.set("ui_hint", "0");
    params.set("ui_ar", "0");
    params.set("ui_ar_help", "0");
    params.set("ui_ar_qrcode", "0");
    params.set("ui_loading", "0");
    params.set("ui_fadeout", "0");
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
