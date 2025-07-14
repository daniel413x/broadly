import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { usdToInteger } from "../utils";
import { stripe } from "@/lib/stripe";
import { generateTenantURL } from "@/lib/utils";
import { CHECKOUT_ROUTE, TENANTS_ROUTE } from "@/lib/data/routes";

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1, "At least one product ID is required"),
        tenantSlug: z.string().min(1, "Tenant slug is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              },
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug,
              },
            }
          ]
        },
      })
      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
      }
      const tenantsData = await ctx.db.find({
        collection: "tenants",
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      });
      const tenant = tenantsData.docs[0];
      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }
      // TODO: throw error if stripe details absent

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.docs.map((product) => ({
        quantity: 1,
        price_data: {
          unit_amount: usdToInteger(product.price), // of course, Stripe expects integers
          currency: "usd",
          product_data: {
            name: product.name,
            metadata: {
              stripeAccountId: tenant.stripeAccountId,
              id: product.id,
              name: product.name,
              price: product.price,
            } as ProductMetadata
          }
        }
      }));
      const checkout = await stripe.checkout.sessions.create({
        // note that ctx.session.user is not null by virtue of how protectedProcedure is implemented
        // protectedProcedure includes a branch that returns a 401 error if session.user is null
        // and the user is explicitly defined in the returned query object
        customer_email: ctx.session.user.email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${TENANTS_ROUTE}/${input.tenantSlug}/${CHECKOUT_ROUTE}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${TENANTS_ROUTE}/${input.tenantSlug}/${CHECKOUT_ROUTE}?cancel=true`,
        mode: "payment",
        line_items: lineItems,
        invoice_creation: {
          enabled: true
        },
        metadata: {
          userId: ctx.session.user.id,
        } as CheckoutMetadata
      });
      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        })
      }
      return { url: checkout.url }
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        // define query paramaters
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          id: {
            in: input.ids,
          },
        },
      });
      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
      }
      const totalPrice = data.docs.reduce((a, b) => {
        const price = Number(b.price);
        const returnedPrice = (isNaN(price) ? 0 : price);
        return a + returnedPrice;
      }, 0);
      return {
        ...data,
        totalPrice,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
