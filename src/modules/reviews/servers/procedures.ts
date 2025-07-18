import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const reviewsRouter = createTRPCRouter({
  // ctx being passed down is not native to tRPC
  // see /trpc/init.ts to see how ctx is passed down
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });
      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      const reviews = await ctx.db.find({
        collection: "reviews",
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
      const review = reviews.docs[0];
      if (!review) {
        return null;
      }
      return review;
    }),
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1, { message: "Rating is required" }).max(5),
        description: z.string().min(1, { message: "Description is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
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
      const existingReviewsData = await ctx.db.find({
        collection: "reviews",
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
      if (existingReviewsData.totalDocs > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already reviewed this product",
        });
      }
      const review = await ctx.db.create({
        collection: "reviews",
        data: {
          product: product.id,
          user: ctx.session.user.id,
          rating: input.rating,
          description: input.description,
        },
      });
      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1, { message: "Rating is required" }).max(5),
        description: z.string().min(1, { message: "Description is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.db.findByID({
        collection: "reviews",
        depth: 0, // existingReview.user will be the user ID
        id: input.reviewId,
      });
      // review to be updated could not be found
      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }
      const isForbiddenUser = !ctx.session.user || !ctx.session.user.id;
      if (isForbiddenUser) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Forbidden procedure",
        });
      }
      const updatedReview = await ctx.db.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });
      return updatedReview;
    }),
});
