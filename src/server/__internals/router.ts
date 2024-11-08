import { Context, Hono, Next } from "hono"
import { HTTPException } from "hono/http-exception"
import { MiddlewareHandler, Variables } from "hono/types"
import { StatusCode } from "hono/utils/http-status"
import { ZodError } from "zod"
import { Bindings } from "../env"
import { bodyParsingMiddleware, queryParsingMiddleware } from "./middleware"
import { MutationOperation, QueryOperation } from "./types"

/**
 * Type representing an operation, which could be a query or mutation.
 *
 * @template I - The input data type for the operation.
 * @template O - The output data type for the operation.
 */
type OperationType<I extends Record<string, unknown>, O> =
  | QueryOperation<I, O>
  | MutationOperation<I, O>

/**
 * Creates a router based on the specified operations.
 *
 * - This router adds query and mutation routes, with support for optional schema validation.
 * - Automatically includes error handling and middleware execution.
 *
 * @template T - The operations for the router, mapping operation names to query/mutation definitions.
 * @param {Record<string, OperationType<any, any>>} obj - The operations to create routes for.
 * @returns {Hono} A configured Hono router instance.
 */
export const router = <T extends Record<string, OperationType<any, any>>>(
  obj: T
) => {
  const route = new Hono<{ Bindings: Bindings; Variables: any }>().onError(
    (err, c) => {
      // Custom error handling for HTTP and unknown exceptions
      if (err instanceof HTTPException) {
        return c.json(
          {
            error: "Server Error",
            message: err.message,
            type: "HTTPException",
          },
          err.status
        )
      } else {
        return c.json(
          {
            error: "Unknown Error",
            message: "An unexpected error occurred",
            type: "UnknownError",
          },
          500
        )
      }
    }
  )

  // Iterate over each operation to set up routes
  Object.entries(obj).forEach(([key, operation]) => {
    const path = `/${key}` as const

    // Apply middlewares for the operation
    const operationMiddlewares: MiddlewareHandler[] = operation.middlewares.map(
      (middleware) => {
        const wrapperFunction = async (c: Context, next: Next) => {
          const ctx = c.get("__middleware_output") ?? {}

          // Wrapper for middleware to manage output context
          const nextWrapper = <B>(args: B) => {
            c.set("__middleware_output", { ...ctx, ...args })
            return { ...ctx, ...args }
          }

          const res = await middleware({ ctx, next: nextWrapper, c })
          c.set("__middleware_output", { ...ctx, ...res })

          await next()
        }

        return wrapperFunction
      }
    )

    // Define routes based on operation type (query or mutation)
    if (operation.type === "query") {
      if (operation.schema) {
        route.get(
          path,
          queryParsingMiddleware,
          ...operationMiddlewares,
          (c) => {
            const ctx = c.get("__middleware_output") || {}
            const parsedQuery = c.get("parsedQuery")

            let input
            try {
              input = operation.schema?.parse(parsedQuery)
            } catch (err) {
              if (err instanceof ZodError) {
                throw new HTTPException(400, {
                  cause: err,
                  message: err.message,
                })
              } else {
                throw err
              }
            }

            return operation.handler({ c, ctx, input })
          }
        )
      } else {
        route.get(path, ...operationMiddlewares, (c) => {
          const ctx = c.get("__middleware_output") || {}

          return operation.handler({ c, ctx, input: undefined })
        })
      }
    } else if (operation.type === "mutation") {
      if (operation.schema) {
        route.post(
          path,
          bodyParsingMiddleware,
          ...operationMiddlewares,
          (c) => {
            const ctx = c.get("__middleware_output") || {}
            const parsedBody = c.get("parsedBody")

            let input
            try {
              input = operation.schema?.parse(parsedBody)
            } catch (err) {
              if (err instanceof ZodError) {
                throw new HTTPException(400, {
                  cause: err,
                  message: err.message,
                })
              } else {
                throw err
              }
            }

            return operation.handler({ c, ctx, input })
          }
        )
      } else {
        route.post(path, ...operationMiddlewares, (c) => {
          const ctx = c.get("__middleware_output") || {}

          return operation.handler({ c, ctx, input: undefined })
        })
      }
    }
  })

  /**
   * Helper type to infer the input type of an operation.
   */
  type InferInput<T> = T extends OperationType<infer I, any> ? I : {}

  /**
   * Helper type to infer the output type of an operation.
   */
  type InferOutput<T> = T extends OperationType<any, infer I> ? I : {}

  // Return the configured route with inferred typings for GET and POST operations
  return route as Hono<
    { Bindings: Bindings; Variables: Variables },
    {
      [K in keyof T]: T[K] extends QueryOperation<any, any>
        ? {
            $get: {
              input: InferInput<T[K]>
              output: InferOutput<T[K]>
              outputFormat: "json"
              status: StatusCode
            }
          }
        : {
            $post: {
              input: InferInput<T[K]>
              output: InferOutput<T[K]>
              outputFormat: "json"
              status: StatusCode
            }
          }
    }
  >
}
