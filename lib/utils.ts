import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Slugify a string for URL use.
 * "Series A" -> "series-a", "E-commerce" -> "e-commerce", "Media & Entertainment" -> "media-entertainment"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Given a slug and an array of original values, find the matching original value.
 * Returns undefined if no match.
 */
export function unslugify(slug: string, originals: readonly string[]): string | undefined {
  return originals.find((v) => slugify(v) === slug)
}
