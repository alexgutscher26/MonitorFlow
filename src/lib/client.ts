import { AppType } from "@/server";
import { hc } from "hono/client";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import superjson from "superjson";

/**
 * Gets the base URL depending on the environment (development, production, or client-side).
 *
 * @returns {string} The base URL for API requests.
 */
const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return "";  // Use relative URL on client-side
  }

  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://<YOUR_DEPLOYED_WORKER_URL>/";
};

/**
 * Base client with a custom fetch implementation for handling responses.
 */
export const baseClient = hc<AppType>(getBaseUrl(), {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, { ...init, cache: "no-store" });

    if (!response.ok) {
      throw new HTTPException(response.status as StatusCode, {
        message: response.statusText,
        res: response,
      });
    }

    const contentType = response.headers.get("Content-Type");

    response.json = async () => {
      const text = await response.text();

      if (contentType === "application/superjson") {
        return superjson.parse(text);
      }

      try {
        return JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse response as JSON:", error);
        throw new Error("Invalid JSON response");
      }
    };

    return response;
  },
})["api"];

/**
 * Type definition for function signatures used in `getHandler`.
 */
type ExecutorFunction = (args: { query?: unknown; json?: unknown }) => Promise<unknown>;

/**
 * Retrieves a nested handler function from an object using an array of keys.
 *
 * @param obj - The base object containing the function.
 * @param keys - The path of keys to locate the function within `obj`.
 * @returns {ExecutorFunction | undefined} - The located function.
 */
function getHandler(obj: Record<string, unknown>, ...keys: string[]): ExecutorFunction | undefined {
  let current: unknown = obj;
  for (const key of keys) {
    if (typeof current === "object" && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      console.error(`Key ${key} not found in object.`);
      return undefined;
    }
  }
  return current as ExecutorFunction;
}

/**
 * Serializes data using SuperJSON to ensure compatibility with the API.
 *
 * @param data - The data object to serialize.
 * @returns The serialized data.
 */
function serializeWithSuperJSON(data: unknown): unknown {
  if (typeof data !== "object" || data === null) {
    return data;
  }
  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([key, value]) => [
      key,
      superjson.stringify(value),
    ])
  );
}

/**
 * Creates a proxy object to dynamically route API calls and serialize data.
 *
 * @param target - The target client object to proxy.
 * @param path - An array representing the path of properties accessed.
 * @returns A proxied client object with `$get` and `$post` methods.
 */
function createProxy<T extends object>(target: T, path: string[] = []): T {
  return new Proxy(target, {
    get(target, prop: string | symbol, receiver) {
      if (typeof prop === "string") {
        const newPath = [...path, prop];

        if (prop === "$get") {
          return async (args?: unknown) => {
            const executor = getHandler(baseClient, ...newPath);
            if (!executor) throw new Error(`Executor not found at path: ${newPath.join(".")}`);
            const serializedQuery = serializeWithSuperJSON(args);
            return await executor({ query: serializedQuery });
          };
        }

        if (prop === "$post") {
          return async (args?: unknown) => {
            const executor = getHandler(baseClient, ...newPath);
            if (!executor) throw new Error(`Executor not found at path: ${newPath.join(".")}`);
            const serializedJson = serializeWithSuperJSON(args);
            return await executor({ json: serializedJson });
          };
        }

        return createProxy((target as Record<string, unknown>)[prop] as T, newPath);
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as T;
}

// Export the client with improved types.
export const client: typeof baseClient = createProxy(baseClient);
