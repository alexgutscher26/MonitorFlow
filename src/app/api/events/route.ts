import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { processEvent } from '@/server/services/event-processor';

// Validation schemas
const saleEventSchema = z.object({
  type: z.literal('sale'),
  action: z.string(),
  data: z.object({
    amount: z.number(),
    currency: z.string(),
    productName: z.string(),
    customerType: z.enum(['new', 'existing']),
    subscriptionType: z.enum(['monthly', 'annual', 'lifetime']).optional(),
  }),
});

const userEventSchema = z.object({
  type: z.literal('user'),
  action: z.string(),
  data: z.object({
    userId: z.string(),
    action: z.enum(['signup', 'login', 'upgrade', 'downgrade']),
    userType: z.enum(['free', 'pro', 'enterprise']).optional(),
    previousPlan: z.string().optional(),
    newPlan: z.string().optional(),
  }),
});

const customEventSchema = z.object({
  type: z.literal('custom'),
  action: z.string(),
  data: z.record(z.any()),
});

const eventSchema = z.discriminatedUnion('type', [
  saleEventSchema,
  userEventSchema,
  customEventSchema,
]);

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return new Response('API key required', { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { apiKey },
      select: { id: true, quotaLimit: true },
    });

    if (!user) {
      return new Response('Invalid API key', { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const event = eventSchema.parse(body);

    // Process the event
    const result = await processEvent({
      ...event,
      userId: user.id,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing event:', error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.errors }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response('Internal server error', { status: 500 });
  }
}
