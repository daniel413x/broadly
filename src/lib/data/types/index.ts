import { Category } from "@/payload-types";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

// queries are configured to populate related docs without nesting them in a category.docs array 
export type NoDocCategory = Category & {
  subcategories: NoDocCategory[];
};

export type CategoriesGetManyOutput = inferRouterOutputs<AppRouter>["categories"]["getMany"];
