import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import { z } from "zod";
import { CURATED, HOT_AND_NEW, sortValues, TRENDING } from "../constants";

export const productsRouter = createTRPCRouter({
  // ctx being passed down is not native to tRPC
  // see /trpc/init.ts to see how ctx is passed down
  getMany: baseProcedure
    .input(
      z.object({
        // define query paramaters
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        price: {},
      };
      let sort: Sort = "-createdAt";
      if (input.sort === CURATED) {
        sort = "name";
      }
      // sort by most recently created objects
      if (input.sort === HOT_AND_NEW) {
        sort = "+createdAt";
      }
      if (input.sort === TRENDING) {
        sort = "-createdAt";
      }
      if (input.minPrice) {
        where.price = {
          ...where.price,
          greater_than_equal: input.minPrice,
        };
      }
      if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        };
      }
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
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }
      const data = await ctx.db.find({
        collection: "products",
        depth: 1, // populate "category", "image"
        where,
        sort,
      });
      return data;
    }),
});
