import { createCheckoutSession } from "@/lib/stripe"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"

/**
 * Router for handling payment-related API endpoints.
 */
export const paymentRouter = router({
  /**
   * Initiates a new Stripe checkout session for the user.
   *
   * - Calls `createCheckoutSession` with the user’s email and ID to create a new session.
   * - Returns the URL for the user to complete the payment process.
   *
   * @returns {object} - An object containing the URL for the Stripe checkout session.
   */
  createCheckoutSession: privateProcedure.mutation(async ({ c, ctx }) => {
    const { user } = ctx

    // Creates a checkout session for the user using Stripe
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    })

    return c.json({ url: session.url })
  }),

  /**
   * Retrieves the current subscription plan of the user.
   *
   * - Queries the user's current plan status from the context.
   * - Returns the plan in a JSON format for easy use on the client side.
   *
   * @returns {object} - An object containing the user’s current subscription plan.
   */
  getUserPlan: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx
    return c.json({ plan: user.plan })
  }),
})
