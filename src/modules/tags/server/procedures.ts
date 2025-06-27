import { DEFAULT_LIMIT } from "@/lib/data/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const tagsRouter = createTRPCRouter({
  // ctx being passed down is not native to tRPC
  // see /trpc/init.ts to see how ctx is passed down
  getMany: baseProcedure
    .input(
      z.object({
        // useInfiniteQuery infiniteQueryOptions depend on this being defined
        // must be accessed in the query below 
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "tags",
        // must be set in the input parser above
        page: input.cursor,
        limit: input.limit,
      });
      return data;
    }),
});
