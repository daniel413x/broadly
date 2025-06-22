import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Where } from "payload";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
  // ctx being passed down is not native to tRPC
  // see /trpc/init.ts to see how ctx is passed down
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      // if depth: 0 then we could use the id
      // but for this codebase, we are not doing that
      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });
        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((subcategoryDoc) => ({
            // Payload does not have type safety fully implemented yet
            // with depth: 1 you can be confident that docs will be of type Category
            ...(subcategoryDoc as Category),
          })),
        }));
        // we will match records using this array
        const subcategoriesSlugs = [];
        const parentCatgory = formattedData[0];
        if (parentCatgory) {
          // compose slug string array
          subcategoriesSlugs.push(
            ...parentCatgory.subcategories.map((subcategory: Category) => subcategory.slug)
          );
          where["category.slug"] = {
            in: [parentCatgory.slug, ...subcategoriesSlugs],
          };
        }
      }
      const data = await ctx.db.find({
        collection: "products",
        depth: 1, // populate "category", "image"
        where,
      });
      return data;
    }),
});
