import { z } from "zod"

/**
 * Validates category names to ensure they:
 * - Are non-empty.
 * - Contain only letters, numbers, or hyphens.
 *
 * @constant CATEGORY_NAME_VALIDATOR
 * @type {ZodString}
 * @throws {ZodError} If the string is empty or contains invalid characters.
 */
export const CATEGORY_NAME_VALIDATOR = z
  .string()
  .min(1, "Category name is required.")
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "Category name can only contain letters, numbers, or hyphens."
  )
