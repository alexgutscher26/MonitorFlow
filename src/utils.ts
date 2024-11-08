import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges class names using `clsx` and `twMerge`.
 * Useful for conditionally merging Tailwind CSS class names, eliminating conflicts.
 *
 * @param inputs - Array of class names, which can include conditions and falsy values.
 * @returns A single merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a color hex code string and converts it to a decimal integer.
 *
 * @param color - A color in hex string format, with or without a leading `#`.
 * @returns The parsed integer representation of the hex color.
 */
export const parseColor = (color: string) => {
  const hex = color.startsWith("#") ? color.slice(1) : color
  return parseInt(hex, 16)
}
