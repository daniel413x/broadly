import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Media, Tenant } from "@/payload-types";

export const tenansRouter = createTRPCRouter({
  // ctx being passed down is not native to tRPC
  // see /trpc/init.ts to see how ctx is passed down
  getOne: baseProcedure
    .input(
      z.object({
        // define query paramaters
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "tenants",
        // depth 2 so that the deeply nested tenant.image is populated
        depth: 2, // populate "category", "image", "tenant.image"
        where: {
          slug: {
            equals: input.slug,
          },
        },
        limit: 1,
        pagination: false,
      });
      const tenant = data.docs[0];
      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }
      return tenant as Tenant & { image: Media | null };
    }),
});
