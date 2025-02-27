import { Context, TypedResponse } from "hono"
import { z } from "zod"
import { Middleware, MutationOperation, QueryOperation } from "./types"
import { StatusCode } from "hono/utils/http-status"
import superjson from "superjson"
import { Bindings } from "../env"

/**
 * Type-level SuperJSON integration
 */
declare module "hono" {
  interface Context {
    superjson: <T>(data: T, status?: number) => SuperJSONTypedResponse<T>
  }
}

type SuperJSONParsedType<T> = ReturnType<typeof superjson.parse<T>>
export type SuperJSONTypedResponse<
  T,
  U extends StatusCode = StatusCode
> = TypedResponse<SuperJSONParsedType<T>, U, "json">

export class Procedure<ctx = Record<string, unknown>> {
  private readonly middlewares: Middleware<ctx>[] = []

  /**
   * Optional, but recommended:
   * This makes "c.superjson" available to your API routes
   */
  private superjsonMiddleware: Middleware<ctx> =
    async function superjsonMiddleware({ c, next }) {
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

  constructor(middlewares: Middleware<ctx>[] = []) {
    this.middlewares = middlewares

    // add built-in superjson middleware if not already present
    if (!this.middlewares.some((mw) => mw.name === "superjsonMiddleware")) {
      this.middlewares.push(this.superjsonMiddleware)
    }
  }

  use<T, Return = void>(
    fn: ({
      ctx,
      next,
      c,
    }: {
      ctx: ctx
      next: <B>(args?: B) => Promise<B & ctx>
      c: Context<{ Bindings: Bindings }>
    }) => Promise<Return>
  ): Procedure<ctx & T & Return> {
    return new Procedure<ctx & T & Return>([...this.middlewares, fn as unknown as Middleware<ctx>])
  }

  input = <Schema extends Record<string, unknown>>(
    schema: z.ZodSchema<Schema>
  ) => ({
    query: <Output>(
      fn: ({
        input,
        ctx,
        c,
      }: {
        input: Schema
        ctx: ctx
        c: Context<{ Bindings: Bindings }>
      }) => TypedResponse<Output> | Promise<TypedResponse<Output>>
    ): QueryOperation<Schema, Output> => ({
      type: "query",
      schema,
      handler: fn as unknown as QueryOperation<Schema, Output>["handler"],
      middlewares: this.middlewares as Middleware<unknown>[],
    }),

    mutation: <Output>(
      fn: ({
        input,
        ctx,
        c,
      }: {
        input: Schema
        ctx: ctx
        c: Context<{ Bindings: Bindings }>
      }) => TypedResponse<Output> | Promise<TypedResponse<Output>>
    ): MutationOperation<Schema, Output> => ({
      type: "mutation",
      schema,
      handler: fn as unknown as MutationOperation<Schema, Output>["handler"],
      middlewares: this.middlewares as Middleware<unknown>[],
    }),
  })

  query<Output>(
    fn: ({
      input,
      ctx,
      c,
    }: {
      input: never
      ctx: ctx
      c: Context<{ Bindings: Bindings }>
    }) =>
      | SuperJSONTypedResponse<Output>
      | Promise<SuperJSONTypedResponse<Output>>
  ): QueryOperation<Record<string, unknown>, Output> {
    return {
      type: "query",
      handler: fn as QueryOperation<Record<string, unknown>, Output>["handler"],
      middlewares: this.middlewares as Middleware<unknown>[],
    }
  }

  mutation<Output>(
    fn: ({
      input,
      ctx,
      c,
    }: {
      input: never
      ctx: ctx
      c: Context<{ Bindings: Bindings }>
    }) => TypedResponse<Output> | Promise<TypedResponse<Output>>
  ): MutationOperation<Record<string, unknown>, Output> {
    return {
      type: "mutation",
      handler: fn as unknown as MutationOperation<Record<string, unknown>, Output>["handler"],
      middlewares: this.middlewares as Middleware<unknown>[],
    }
  }
}
