import superjson from "superjson"

/**
 * Safely parses a JSON string using SuperJSON. If parsing fails, returns the original string.
 *
 * @param value - A JSON string to parse.
 * @returns The parsed value if parsing is successful; otherwise, returns the original string.
 */
export const parseSuperJSON = (value: string) => {
  try {
    return superjson.parse(value)
  } catch {
    // Return the original value if parsing fails
    return value
  }
}
