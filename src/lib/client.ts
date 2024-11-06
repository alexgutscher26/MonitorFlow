import { AppType } from "@/server";
import { hc } from "hono/client";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import superjson from "superjson";

// Function to get the base URL depending on the environment
const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return "";
  }

  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://<YOUR_DEPLOYED_WORKER_URL>/";
};

// Base client with a custom fetch implementation
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

// Type definition for function signatures used in getHandler
type ExecutorFunction = (args: { query?: any; json?: any }) => Promise<any>;

// Updated getHandler with proper type
function getHandler(obj: Record<string, any>, ...keys: string[]): ExecutorFunction {
  let current = obj;
  for (const key of keys) {
    current = current[key];
  }
  return current as ExecutorFunction;
}

// Serializes data with SuperJSON
function serializeWithSuperJSON(data: any): any {
  if (typeof data !== "object" || data === null) {
    return data;
  }
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      superjson.stringify(value),
    ])
  );
}

/**
 * Proxy to pass data directly to your API instead of nested objects as hono does by default.
 */
function createProxy(target: any, path: string[] = []): any {
  return new Proxy(target, {
    get(target, prop: string | symbol, receiver) {
      if (typeof prop === "string") {
        const newPath = [...path, prop];

        if (prop === "$get") {
          return async (...args: any[]) => {
            const executor = getHandler(baseClient, ...newPath);
            const serializedQuery = serializeWithSuperJSON(args[0]);
            return await executor({ query: serializedQuery });
          };
        }

        if (prop === "$post") {
          return async (...args: any[]) => {
            const executor = getHandler(baseClient, ...newPath);
            const serializedJson = serializeWithSuperJSON(args[0]);
            return await executor({ json: serializedJson });
          };
        }

        return createProxy((target as Record<string, any>)[prop], newPath);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

// Export the client with improved types
export const client: typeof baseClient = createProxy(baseClient);
