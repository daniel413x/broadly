import { Category } from "@/payload-types";

// queries are configured to populate related docs without nesting them in a category.docs array 
export type NoDocCategory = Category & {
  subcategories: NoDocCategory[];
};
