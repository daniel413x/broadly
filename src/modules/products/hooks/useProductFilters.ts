import { useQueryStates } from "nuqs";
import { parseAsString, createLoader } from "nuqs/server";

export const params = {
  minPrice:
    parseAsString.withOptions({ clearOnDefault: true }),
  maxPrice:
    parseAsString.withOptions({ clearOnDefault: true }),
};

export const useProductFilters = () => {
  return useQueryStates(params);
};

// for parsing/reading params server-side
export const loadProductFilters = createLoader(params);
