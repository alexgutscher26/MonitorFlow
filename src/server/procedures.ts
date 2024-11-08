import { db } from "@/db"
import { j } from "./__internals/j"
import { currentUser } from "@clerk/nextjs/server"
import { HTTPException } from "hono/http-exception"

/**
 * Middleware to authenticate requests.
 * Checks for a valid API key in the Authorization header, or uses `@clerk/nextjs` to authenticate.
 *
 * - First, checks if an `Authorization` header with a Bearer API key is present.
 * - If an API key is found, it queries the database for a matching user.
 * - If no API key is found or valid, it attempts to retrieve the current user via `@clerk/nextjs`.
 * - If authentication fails in both cases, it throws a 401 Unauthorized HTTP exception.
 *
 * @param {object} c - Context containing the request and response objects.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} Proceeds to the next middleware if authentication is successful.
 */
const authMiddleware = j.middleware(async ({ c, next }) => {
  const authHeader = c.req.header("Authorization")

  if (authHeader) {
    const apiKey = authHeader.split(" ")[1] // Extracts API key from "Bearer <API_KEY>"

    const user = await db.user.findUnique({
      where: { apiKey },
    })

    if (user) return next({ user })
  }

  const auth = await currentUser()

  if (!auth) {
    throw new HTTPException(401, { message: "Unauthorized" }) // Throws if no Clerk user is found
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" }) // Throws if no matching user in the database
  }

  return next({ user }) // Proceeds to the next step with authenticated user data
})

/**
 * Public (unauthenticated) procedure base.
 * This is the base component used to build new public API queries and mutations.
 */
export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure

/**
 * Private (authenticated) procedure.
 * Builds on `publicProcedure` but includes `authMiddleware` for user authentication.
 */
export const privateProcedure = publicProcedure.use(authMiddleware)
