/**
 * Internal middlewares
 * Do not modify unless you know what you're doing
 */

import { MiddlewareHandler } from "hono"
import { parseSuperJSON } from "./utils"

/**
 * Middleware to parse GET request query parameters using SuperJSON.
 *
 * - Iterates over each query parameter and attempts to parse it using SuperJSON.
 * - Stores the parsed query parameters in the context under the key `parsedQuery`.
 *
 * @param c - The context object provided by Hono.
 * @param next - The next middleware function in the Hono pipeline.
 */
export const queryParsingMiddleware: MiddlewareHandler = async (c, next) => {
  const rawQuery = c.req.query()
  const parsedQuery: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(rawQuery)) {
    parsedQuery[key] = parseSuperJSON(value)
  }

  c.set("parsedQuery", parsedQuery)
  await next()
}

/**
 * Middleware to parse POST request body using SuperJSON.
 *
 * - Reads and parses the JSON body of the request.
 * - Attempts to parse each body parameter using SuperJSON for advanced data types.
 * - Stores the parsed body in the context under the key `parsedBody`.
 *
 * @param c - The context object provided by Hono.
 * @param next - The next middleware function in the Hono pipeline.
 */
export const bodyParsingMiddleware: MiddlewareHandler = async (c, next) => {
  const rawBody = await c.req.json()
  const parsedBody: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(rawBody)) {
    parsedBody[key] = parseSuperJSON(value as any)
  }

  c.set("parsedBody", parsedBody)
  await next()
}
