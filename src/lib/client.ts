import { AppType } from "@/server"
import { hc } from "hono/client"
import { HTTPException } from "hono/http-exception"
import { StatusCode } from "hono/utils/http-status"
import superjson from "superjson"

const getBaseUrl = () => {
  // browser should use relative path
  if (typeof window !== "undefined") {
    return ""
  }

  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://<YOUR_DEPLOYED_WORKER_URL>/"
}

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

function getHandler(obj: object, ...keys: string[]) {
  let current = obj
  for (const key of keys) {
    current = current[key as keyof typeof current]
  }
  return current as (...args: unknown[]) => Promise<unknown>
}

function serializeWithSuperJSON<T>(data: T): Record<string, unknown> {
  if (typeof data !== "object" || data === null) {
    return { value: data }
  }
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      superjson.stringify(value),
    ])
  )
}

/**
 * This is an optional convenience proxy to pass data directly to your API
 * instead of using nested objects as hono does by default
 */
function createProxy<T extends object>(target: T, path: string[] = []): T {
  return new Proxy(target, {
    get(target, prop, receiver) {
      if (typeof prop === "string") {
        const newPath = [...path, prop]

        if (prop === "$get") {
          return async <R>(query?: unknown): Promise<R> => {
            const executor = getHandler(baseClient, ...newPath)
            const serializedQuery = serializeWithSuperJSON(query)
            return executor({ query: serializedQuery }) as Promise<R>
          }
        }

        if (prop === "$post") {
          return async <R>(data?: unknown): Promise<R> => {
            const executor = getHandler(baseClient, ...newPath)
            const serializedJson = serializeWithSuperJSON(data)
            return executor({ json: serializedJson }) as Promise<R>
          }
        }

        return createProxy(target[prop as keyof T] as object, newPath)
      }
      return Reflect.get(target, prop, receiver)
    },
  })
}

export const client: typeof baseClient = createProxy(baseClient)
