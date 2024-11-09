import { AppType } from "@/server"
import { hc } from "hono/client"
import { HTTPException } from "hono/http-exception"
import { StatusCode } from "hono/utils/http-status"
import superjson from "superjson"

/**
 * Determines the base URL for the client, depending on the environment.
 *
 * - Uses a relative path if in a browser.
 * - Uses localhost for development.
 * - Uses the Vercel URL for production, or a fallback URL if unavailable.
 *
 * @returns The base URL string.
 */
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return ""
  }

  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://<YOUR_DEPLOYED_WORKER_URL>/"
}

/**
 * Base client for API requests, handling errors and parsing responses.
 */
export const baseClient = hc<AppType>(getBaseUrl(), {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, { ...init, cache: "no-store" })

    if (!response.ok) {
      throw new HTTPException(response.status as StatusCode, {
        message: response.statusText,
        res: response,
      })
    }

    const contentType = response.headers.get("Content-Type")

    response.json = async () => {
      const text = await response.text()

      if (contentType === "application/superjson") {
        return superjson.parse(text)
      }

      try {
        return JSON.parse(text)
      } catch (error) {
        console.error("Failed to parse response as JSON:", error)
        throw new Error("Invalid JSON response")
      }
    }

    return response
  },
})["api"]

/**
 * Retrieves a nested function handler within an object.
 *
 * @param obj - The object containing nested functions.
 * @param keys - Path keys to reach the target function.
 * @returns The function at the specified path within the object.
 */
function getHandler(obj: Object, ...keys: string[]) {
  let current = obj
  for (const key of keys) {
    current = current[key as keyof typeof current]
  }
  return current as Function
}

/**
 * Serializes an object using SuperJSON, ensuring compatibility for complex data types.
 *
 * @param data - The data to be serialized.
 * @returns A new object with all values serialized by SuperJSON.
 */
function serializeWithSuperJSON(data: any): any {
  if (typeof data !== "object" || data === null) {
    return data
  }
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      superjson.stringify(value),
    ])
  )
}

/**
 * Creates a proxy to allow convenient access to API endpoints.
 *
 * - Automatically handles `$get` and `$post` requests, serializing data with SuperJSON.
 * - Allows nested property access to mimic structured API endpoints.
 *
 * @param target - The target API client.
 * @param path - The path of keys to reach the desired endpoint.
 * @returns A Proxy object that provides easy access to API methods.
 */
function createProxy(target: any, path: string[] = []): any {
  return new Proxy(target, {
    get(target, prop, receiver) {
      if (typeof prop === "string") {
        const newPath = [...path, prop]

        if (prop === "$get") {
          return async (...args: any[]) => {
            const executor = getHandler(baseClient, ...newPath)
            const serializedQuery = serializeWithSuperJSON(args[0])
            return executor({ query: serializedQuery })
          }
        }

        if (prop === "$post") {
          return async (...args: any[]) => {
            const executor = getHandler(baseClient, ...newPath)
            const serializedJson = serializeWithSuperJSON(args[0])
            return executor({ json: serializedJson })
          }
        }

        return createProxy(target[prop], newPath)
      }
      return Reflect.get(target, prop, receiver)
    },
  })
}

/**
 * The main API client proxy, providing convenient access to API routes.
 * 
 * - `client.$get` for GET requests with serialized query parameters.
 * - `client.$post` for POST requests with serialized JSON body.
 */
export const client: typeof baseClient = createProxy(baseClient)
