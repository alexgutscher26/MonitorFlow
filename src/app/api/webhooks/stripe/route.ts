import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

/**
 * Handles incoming POST requests from Stripe webhooks.
 *
 * This function verifies the webhook signature, parses the event, and
 * updates the user's plan in the database if the checkout session was completed.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Promise<Response>} The response object with the status of the request processing.
 */
export async function POST(req: Request): Promise<Response> {
  const body = await req.text();
  const signature = headers().get("stripe-signature");
  
  if (!signature) {
    return new Response("Missing Stripe signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (!userId) {
      console.warn("Invalid metadata: Missing userId");
      return new Response("Invalid metadata: Missing userId", { status: 400 });
    }

    try {
      await db.user.update({
        where: { id: userId },
        data: { plan: "PRO" },
      });
      console.log(`User ${userId} plan updated to PRO.`);
    } catch (dbError) {
      console.error("Database update failed:", dbError);
      return new Response("Database update failed", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
