import { Context, TypedResponse } from "hono"
import { z } from "zod"

import { httpHandler } from "@/server"
import { Variables } from "hono/types"
import { Bindings } from "../env"

/**
 * Middleware type for handling request context and advancing to the next middleware.
 *
 * @template I - Type of the context passed to the middleware.
 */
export type Middleware<I> = (params: {
  ctx: I
  next: <B>(args?: B) => B & I
  c: Context<{ Bindings: Bindings; Variables: Variables }>
}) => Promise<any>

/**
 * Defines the structure for a query operation.
 * 
 * - `type`: Identifies this operation as a "query".
 * - `schema`: Optional Zod schema for validating the query input.
 * - `handler`: Function to process the query, returning a `TypedResponse`.
 * - `middlewares`: Array of middleware functions to execute before the handler.
 *
 * @template Schema - Expected shape of the query data.
 * @template ZodInput - Input type used in handler after Zod validation.
 */
export type QueryOperation<
  Schema extends Record<string, unknown>,
  ZodInput = never
> = {
  type: "query"
  schema?: z.ZodType<Schema>
  handler: <Ctx, Output>(params: {
    ctx: Ctx
    c: Context
    input: ZodInput
  }) => Promise<TypedResponse<Output>>
  middlewares: Middleware<any>[]
}

/**
 * Defines the structure for a mutation operation.
 * 
 * - `type`: Identifies this operation as a "mutation".
 * - `schema`: Optional Zod schema for validating mutation input.
 * - `handler`: Function to process the mutation, returning a `TypedResponse`.
 * - `middlewares`: Array of middleware functions to execute before the handler.
 *
 * @template Schema - Expected shape of the mutation data.
 * @template ZodInput - Input type used in handler after Zod validation.
 */
export type MutationOperation<
  Schema extends Record<string, unknown>,
  ZodInput = never
> = {
  type: "mutation"
  schema?: z.ZodType<Schema>
  handler: <Input, Output>(params: {
    ctx: Input
    c: Context
    input: ZodInput
  }) => Promise<TypedResponse<Output>>
  middlewares: Middleware<any>[]
}

/**
 * Exports `httpHandler` functions for GET and POST HTTP methods.
 * 
 * - `GET`: Maps to `httpHandler` for handling GET requests.
 * - `POST`: Maps to `httpHandler` for handling POST requests.
 */
export { httpHandler as GET, httpHandler as POST }
