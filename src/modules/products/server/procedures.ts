import { headers as getHeaders } from "next/headers";
import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import { z } from "zod";
import { CURATED, HOT_AND_NEW, sortValues, TRENDING } from "../constants";
import { DEFAULT_LIMIT } from "@/lib/data/constants";

export const productsRouter = createTRPCRouter({
  // ctx being passed down is not native to tRPC
  // see /trpc/init.ts to see how ctx is passed down
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });
      const data = await ctx.db.findByID({
        collection: "products",
        id: input.id,
      });
      // isPurchased provides information for the client at the route
      // /tenants/[tenantId]/products/[productId]
      let isPurchased = false;
      if (session.user) {
        const ordersData = await ctx.db.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });
        isPurchased = !!ordersData.docs[0];
      }
      return {
        ...data,
        isPurchased,
        image: data.image as Media | null,
        tenant: data.tenant as Tenant & { image: Media | null },
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        // define query paramaters
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        tenantSlug: z.string().nullable().optional(),
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
      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
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
        // depth 2 so that the deeply nested tenant.image is populated
        depth: 2, // populate "category", "image", "tenant.image"
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });
      /*
      can just do:
      return data;
      but the query return must be modified in this case to handle images; see ProductCard
      */
      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
