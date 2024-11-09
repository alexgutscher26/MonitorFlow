import { Prisma } from "@prisma/client";
import { Redis } from "@upstash/redis/cloudflare";
import superjson, { SuperJSONResult } from "superjson";

export type CacheArgs = { cache?: { id: string; ttl?: number } };

/**
 * Type guard to check if an object is a SuperJSONResult.
 *
 * @param obj - Object to check.
 * @returns True if the object is a valid SuperJSONResult.
 */
function isSuperJSONResult(obj: any): obj is SuperJSONResult {
  return (
    typeof obj === "object" && obj !== null && "json" in obj && "meta" in obj
  );
}

/**
 * Prisma extension to provide built-in caching with Upstash Redis.
 * 
 * - Caches read operations (`findFirst`, `findUnique`, `findMany`) in Redis.
 * - Clears relevant cache keys on write operations (`create`, `update`, `delete`).
 *
 * @param redis - Upstash Redis client instance.
 * @returns Prisma extension with caching for specified operations.
 */
export const cacheExtension = ({ redis }: { redis: Redis }) => {
  return Prisma.defineExtension({
    name: "prisma-extension-cache",
    model: {
      $allModels: {
        /**
         * Finds the first record matching the query and caches the result.
         *
         * @param args - Prisma arguments with optional caching configuration.
         * @returns Cached or fresh result from the database.
         */
        async findFirst<T, A>(
          this: T,
          args: Prisma.Args<T, "findFirst"> & CacheArgs
        ): Promise<Prisma.Result<T, A, "findFirst">> {
          const { cache: _cache, ...rest } = args;
          const cache = _cache as CacheArgs["cache"];
          const ctx = Prisma.getExtensionContext(this);

          if (cache) {
            const cachedResult = await redis.get<string>(cache.id);

            if (cachedResult && isSuperJSONResult(cachedResult)) {
              return superjson.deserialize<Prisma.Result<T, A, "findFirst">>(
                cachedResult
              );
            }
          }

          const result = await (ctx as any).$parent[ctx.$name as any].findFirst(
            rest
          );

          if (cache && result) {
            const serializedResult = superjson.stringify(result);
            await redis.set(cache.id, serializedResult, cache.ttl ? { ex: cache.ttl } : undefined);
          }

          return result;
        },

        /**
         * Finds a unique record matching the query and caches the result.
         *
         * @param args - Prisma arguments with optional caching configuration.
         * @returns Cached or fresh result from the database.
         */
        async findUnique<T, A>(
          this: T,
          args: Prisma.Args<T, "findUnique"> & CacheArgs
        ): Promise<Prisma.Result<T, A, "findUnique">> {
          const { cache: _cache, ...rest } = args;
          const cache = _cache as CacheArgs["cache"];
          const ctx = Prisma.getExtensionContext(this);

          if (cache) {
            const cachedResult = await redis.get<string>(cache.id);

            if (cachedResult && isSuperJSONResult(cachedResult)) {
              return superjson.deserialize<Prisma.Result<T, A, "findUnique">>(
                cachedResult
              );
            }
          }

          const result = await (ctx as any).$parent[ctx.$name as any].findUnique(rest);

          if (cache && result) {
            const serializedResult = superjson.stringify(result);
            await redis.set(cache.id, serializedResult, cache.ttl ? { ex: cache.ttl } : undefined);
          }

          return result;
        },

        /**
         * Finds multiple records matching the query and caches the result.
         *
         * @param args - Prisma arguments with optional caching configuration.
         * @returns Cached or fresh result from the database.
         */
        async findMany<T, A>(
          this: T,
          args: Prisma.Args<T, "findMany"> & CacheArgs
        ): Promise<Prisma.Result<T, A, "findMany">> {
          const { cache: _cache, ...rest } = args;
          const cache = _cache as CacheArgs["cache"];
          const ctx = Prisma.getExtensionContext(this);

          if (cache) {
            const cachedResult = await redis.get<string>(cache.id);

            if (cachedResult && isSuperJSONResult(cachedResult)) {
              return superjson.deserialize<Prisma.Result<T, A, "findMany">>(
                cachedResult
              );
            }
          }

          const result = await (ctx as any).$parent[ctx.$name as any].findMany(rest);

          if (cache && result) {
            const serializedResult = superjson.stringify(result);
            await redis.set(cache.id, serializedResult, cache.ttl ? { ex: cache.ttl } : undefined);
          }

          return result;
        },

        /**
         * Creates a new record and clears the relevant cache if specified.
         *
         * @param args - Prisma arguments with optional caching configuration.
         * @returns The created record from the database.
         */
        async create<T, A>(
          this: T,
          args: Prisma.Args<T, "create"> & CacheArgs
        ): Promise<Prisma.Result<T, A, "create">> {
          const { cache: _cache, ...rest } = args;
          const cache = _cache as CacheArgs["cache"];
          const ctx = Prisma.getExtensionContext(this);

          if (cache) {
            await redis.del(cache.id);
          }

          const result = await (ctx as any).$parent[ctx.$name as any].create(rest);

          return result;
        },

        /**
         * Updates a record and clears the relevant cache if specified.
         *
         * @param args - Prisma arguments with optional caching configuration.
         * @returns The updated record from the database.
         */
        async update<T, A>(
          this: T,
          args: Prisma.Args<T, "update"> & CacheArgs
        ): Promise<Prisma.Result<T, A, "update">> {
          const { cache: _cache, ...rest } = args;
          const cache = _cache as CacheArgs["cache"];
          const ctx = Prisma.getExtensionContext(this);

          if (cache) {
            await redis.del(cache.id);
          }

          const result = await (ctx as any).$parent[ctx.$name as any].update(rest);

          return result;
        },

        /**
         * Deletes a record and clears the relevant cache if specified.
         *
         * @param args - Prisma arguments with optional caching configuration.
         * @returns The deleted record from the database.
         */
        async delete<T, A>(
          this: T,
          args: Prisma.Args<T, "delete"> & CacheArgs
        ): Promise<Prisma.Result<T, A, "delete">> {
          const { cache: _cache, ...rest } = args;
          const cache = _cache as CacheArgs["cache"];
          const ctx = Prisma.getExtensionContext(this);

          if (cache) {
            await redis.del(cache.id);
          }

          const result = await (ctx as any).$parent[ctx.$name as any].delete(rest);

          return result;
        },
      },
    },
  });
};
