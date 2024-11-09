import Stripe from "stripe"

/**
 * Stripe client instance initialized with secret key from environment variables.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-09-30.acacia",
  typescript: true,
})

/**
 * Creates a Stripe Checkout session for a single product.
 *
 * @param userEmail - The email of the user initiating the checkout session.
 * @param userId - The user ID, stored as metadata in Stripe for reference.
 * @returns A Stripe Checkout session object containing the session URL and other details.
 */
export const createCheckoutSession = async ({
  userEmail,
  userId,
}: {
  userEmail: string
  userId: string
}) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1QBHVBA19umTXGu8gzhUCSG7", // Product price ID from Stripe
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: userEmail,
    metadata: {
      userId,
    },
  })

  return session
}
