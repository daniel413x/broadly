import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPayload } from "payload";
import Stripe from "stripe";
import configPromise from "@payload-config";
import { ExpandedLineItem } from "@/modules/checkout/types";

const wtf = "@@@@@@@@@@@@@ @@@@@@@@@@@@@@@@@@@ @@@@@@@@@@@@@@@@@@@ @@@@@@@@@@@@@@@@@@@";

export async function POST(req: Request) {
  let event: Stripe.Event;
  console.log(wtf);
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
  console.log("permittedEvents");
  const permittedEvents: string[] = [
    "checkout.session.completed",
  ];
  const payload = await getPayload({ config: configPromise });
  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          console.log("checkout.session.completed");
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
            }
          );
          if (!expandedSession.line_items?.data || expandedSession.line_items.data.length === 0) {
            throw new Error("No line items found");
          }
          const lineItems = expandedSession.line_items.data as ExpandedLineItem[];
          console.log(lineItems);
          await Promise.all((lineItems.map(async (lineItem) => {
            console.log(lineItem);
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                user: user.id,
                product: lineItem.price.product.metadata.id,
                name: lineItem.price.product.name,
              },
            });
          })));
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
