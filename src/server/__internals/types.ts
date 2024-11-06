import { Context, TypedResponse } from "hono";
import { z } from "zod";

import { httpHandler } from "@/server";
import { Variables } from "hono/types";
import { Bindings } from "../env";

// Middleware type, with a generic for better type inference
export type Middleware<I> = (args: {
  ctx: I;
  next: <B>(args?: B) => B & I;
  c: Context<{ Bindings: Bindings; Variables: Variables }>;
}) => Promise<unknown>;

// Query operation type, with improved generics and type inference for handler and middleware
export type QueryOperation<
  Schema extends Record<string, unknown>,
  ZodInput = never,
  Ctx = unknown,
  Output = unknown
> = {
  type: "query";
  schema?: z.ZodType<Schema>;
  handler: (args: { ctx: Ctx; c: Context; input: ZodInput }) => Promise<TypedResponse<Output>>;
  middlewares: Middleware<Ctx>[];
};

// Mutation operation type, with improved generics and type inference for handler and middleware
export type MutationOperation<
  Schema extends Record<string, unknown>,
  ZodInput = never,
  Input = unknown,
  Output = unknown
> = {
  type: "mutation";
  schema?: z.ZodType<Schema>;
  handler: (args: { ctx: Input; c: Context; input: ZodInput }) => Promise<TypedResponse<Output>>;
  middlewares: Middleware<Input>[];
};

// Export HTTP methods
export { httpHandler as GET, httpHandler as POST };
