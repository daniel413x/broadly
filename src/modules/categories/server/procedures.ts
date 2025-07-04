import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
  // ctx being passed down is not native to tRPC
  // see /trpc/init.ts to see how ctx is passed down
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      depth: 1,
      // there should never be too many categories to justify pagination
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });
    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((subcategoryDoc) => ({
        // Payload does not have type safety fully implemented yet
        // with depth: 1 you can be confident that docs will be of type Category
        ...(subcategoryDoc as Category),
      })),
    }));
    return formattedData;
  }),
});
