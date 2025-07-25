import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { DEFAULT_LIMIT } from "@/lib/data/constants";
import { TRPCError } from "@trpc/server";
import { generateProductsWithSummarizedReviews } from "@/modules/utils";

export const libraryRouter = createTRPCRouter({
  // ctx being passed down is not native to tRPC
  // see /trpc/init.ts to see how ctx is passed down
  getOne: protectedProcedure
    .input(
      z.object({
        // define query paramaters
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "orders",
        pagination: false,
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });
      const order = data.docs[0];
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return product;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        // define query paramaters
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "orders",
        page: input.cursor,
        limit: input.limit,
        depth: 0,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });
      // products will be strings by virtue of depth: 0
      const productIds = data.docs.map((order) => order.product);
      const productsData = await ctx.db.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });
      const dataWithSummarizedReviews = await generateProductsWithSummarizedReviews(ctx.db, productsData);
      return {
        ...productsData,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
