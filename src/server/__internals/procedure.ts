import { Context, TypedResponse } from "hono"
import { z } from "zod"
import { Middleware, MutationOperation, QueryOperation } from "./types"
import { StatusCode } from "hono/utils/http-status"
import superjson from "superjson"
import { Bindings } from "../env"

/**
 * Adds SuperJSON integration to Hono's `Context`.
 */
declare module "hono" {
  interface Context {
    /**
     * A utility to serialize data using SuperJSON and return a typed response.
     *
     * @param data - Data to serialize and return in the response.
     * @param status - HTTP status code for the response.
     * @returns A typed SuperJSON response.
     */
    superjson: <T>(data: T, status?: number) => SuperJSONTypedResponse<T>
  }
}

/**
 * Defines the type for data parsed by SuperJSON.
 *
 * @template T - Type of the original data.
 */
type SuperJSONParsedType<T> = ReturnType<typeof superjson.parse<T>>

/**
 * Typed response format for responses serialized using SuperJSON.
 *
 * @template T - Type of the serialized data.
 * @template U - HTTP status code (defaults to generic StatusCode).
 */
export type SuperJSONTypedResponse<
  T,
  U extends StatusCode = StatusCode
> = TypedResponse<SuperJSONParsedType<T>, U, "json">

/**
 * The `Procedure` class is used to create query and mutation operations with middleware support.
 *
 * @template ctx - Type of the context passed to each middleware and handler.
 */
export class Procedure<ctx = {}> {
  private readonly middlewares: Middleware<ctx>[] = []

  /**
   * Middleware for serializing responses using SuperJSON.
   * Ensures `c.superjson` is available to API routes.
   */
  private superjsonMiddleware: Middleware<ctx> = async function superjsonMiddleware({
    c,
    next,
  }) {
    type JSONRespond = typeof c.json

    c.superjson = (<T>(data: T, status?: StatusCode): Response => {
      const serialized = superjson.stringify(data)
      return new Response(serialized, {
        status: status || 200,
        headers: { "Content-Type": "application/superjson" },
      })
    }) as JSONRespond

    return await next()
  }

  /**
   * Creates a new `Procedure` with optional middleware.
   *
   * @param middlewares - Array of middlewares to apply to the procedure.
   */
  constructor(middlewares: Middleware<ctx>[] = []) {
    this.middlewares = middlewares

    // Add SuperJSON middleware if not already present
    if (!this.middlewares.some((mw) => mw.name === "superjsonMiddleware")) {
      this.middlewares.push(this.superjsonMiddleware)
    }
  }

  /**
   * Adds a new middleware to the procedure.
   *
   * @template T - Additional context added by the middleware.
   * @param fn - Middleware function to add.
   * @returns A new `Procedure` instance with the added middleware.
   */
  use<T, Return = void>(
    fn: (params: {
      ctx: ctx
      next: <B>(args?: B) => Promise<B & ctx>
      c: Context<{ Bindings: Bindings }>
    }) => Promise<Return>
  ): Procedure<ctx & T & Return> {
    return new Procedure<ctx & T & Return>([...this.middlewares, fn as any])
  }

  /**
   * Validates input for query or mutation operations using a Zod schema.
   *
   * @param schema - Zod schema to validate the input.
   * @returns An object with `query` and `mutation` methods to create operations.
   */
  input = <Schema extends Record<string, unknown>>(
    schema: z.ZodSchema<Schema>
  ) => ({
    /**
     * Creates a query operation with input validation.
     *
     * @template Output - Type of the output data from the query.
     * @param fn - Handler function for the query.
     * @returns A `QueryOperation` with input validation.
     */
    query: <Output>(fn: (params: {
      input: Schema
      ctx: ctx
      c: Context<{ Bindings: Bindings }>
    }) => TypedResponse<Output> | Promise<TypedResponse<Output>>): QueryOperation<Schema, Output> => ({
      type: "query",
      schema,
      handler: fn as any,
      middlewares: this.middlewares,
    }),

    /**
     * Creates a mutation operation with input validation.
     *
     * @template Output - Type of the output data from the mutation.
     * @param fn - Handler function for the mutation.
     * @returns A `MutationOperation` with input validation.
     */
    mutation: <Output>(fn: (params: {
      input: Schema
      ctx: ctx
      c: Context<{ Bindings: Bindings }>
    }) => TypedResponse<Output> | Promise<TypedResponse<Output>>): MutationOperation<Schema, Output> => ({
      type: "mutation",
      schema,
      handler: fn as any,
      middlewares: this.middlewares,
    }),
  })

  /**
   * Creates a query operation without input validation.
   *
   * @template Output - Type of the output data from the query.
   * @param fn - Handler function for the query.
   * @returns A `QueryOperation` without input validation.
   */
  query<Output>(fn: (params: {
    input: never
    ctx: ctx
    c: Context<{ Bindings: Bindings }>
  }) => SuperJSONTypedResponse<Output> | Promise<SuperJSONTypedResponse<Output>>): QueryOperation<{}, Output> {
    return {
      type: "query",
      handler: fn as any,
      middlewares: this.middlewares,
    }
  }

  /**
   * Creates a mutation operation without input validation.
   *
   * @template Output - Type of the output data from the mutation.
   * @param fn - Handler function for the mutation.
   * @returns A `MutationOperation` without input validation.
   */
  mutation<Output>(fn: (params: {
    input: never
    ctx: ctx
    c: Context<{ Bindings: Bindings }>
  }) => TypedResponse<Output> | Promise<TypedResponse<Output>>): MutationOperation<{}, Output> {
    return {
      type: "mutation",
      handler: fn as any,
      middlewares: this.middlewares,
    }
  }
}
