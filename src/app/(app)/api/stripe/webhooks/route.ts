import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPayload } from "payload";
import Stripe from "stripe";
import configPromise from "@payload-config";
import { ExpandedLineItem } from "@/modules/checkout/types";

export async function POST(req: Request) {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log(`🔴 Error: ${errorMessage}`);
    return NextResponse.json(
      {
        message: `Webhook Error: ${errorMessage}`,
        status: 400,
      }
    );
  }
  const permittedEvents: string[] = [
    "checkout.session.completed",
    "account.updated",
    "payment_intent.succeeded",
  ];
  const payload = await getPayload({ config: configPromise });
  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const data = event.data.object as Stripe.Checkout.Session;
          // user ID is required to know who actually made the purchase
          if (!data.metadata?.userId) {
            throw new Error("User ID is required");
          }
          const user = await (await payload).findByID({
            collection: "users",
            id: data.metadata?.userId,
          });
          if (!user) {
            throw new Error("User not found");
          }
          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            },
            {
              stripeAccount: event.account,
            }
          );
          if (!expandedSession.line_items?.data || expandedSession.line_items.data.length === 0) {
            throw new Error("No line items found");
          }
          const lineItems = expandedSession.line_items.data as ExpandedLineItem[];
          await Promise.all((lineItems.map(async (lineItem) => {
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                stripeAccountId: event.account!,
                user: user.id,
                product: lineItem.price.product.metadata.id,
                name: lineItem.price.product.name,
              },
            });
          })));
          break;
        }
        // mock session checkout
        // should be as close as possible to case "checkout.session.completed"
        // intended for API-based testing only, e.g. JMeter
        case "payment_intent.succeeded": {
          const data = event.data.object as Stripe.PaymentIntent;
          if (!data.metadata?.userId) {
            throw new Error("User ID is required");
          }
          const user = await (await payload).findByID({
            collection: "users",
            id: data.metadata?.userId,
          });
          if (!user) {
            throw new Error("User not found");
          }
          // unlike sessions, line items are stored directly in metadata when the payment intent is created
          if (!data.metadata?.line_items || data.metadata?.line_items.length === 0) {
            throw new Error("No line items found");
          }
          const lineItems = await JSON.parse(data.metadata.line_items!);
          await Promise.all(lineItems.map(async (lineItem: ExpandedLineItem) => {
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                stripeAccountId: event.account!,
                user: user.id,
                product: lineItem.price.product.metadata.id,
                name: lineItem.price.product.name,
              },
            });
          }));
          break;
        }
        case "account.updated": {
          const data = event.data.object as Stripe.Account;
          await payload.update({
            collection: "tenants",
            where: {
              stripeAccountId: {
                equals: data.id,
              },
            },
            data: {
              stripeDetailsSubmitted: data.details_submitted,
            },
          });
          break;
        }
        default: {
          throw new Error(`Unhandled event type: ${event.type}`);
        }
      }
    } catch {
      return NextResponse.json({
        message: "Webhook handler failed",
        status: 500,
      });
    }
  }
  return NextResponse.json({
    message: "Received",
    status: 200,
  });
};
