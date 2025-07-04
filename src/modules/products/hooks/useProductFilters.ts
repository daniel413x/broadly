import { useQueryStates, parseAsString, parseAsArrayOf, parseAsStringLiteral } from "nuqs";
import { CURATED, sortValues } from "../constants";

const params = {
  sort: parseAsStringLiteral(sortValues).withDefault(CURATED),
  minPrice:
    parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  maxPrice:
    parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  tags:
    parseAsArrayOf(parseAsString)
      .withOptions({
        clearOnDefault: true,
      }).withDefault([]),
};

export const useProductFilters = () => {
  return useQueryStates(params);
};
