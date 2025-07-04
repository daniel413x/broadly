// see https://nuqs.47ng.com/docs/server-side

import { parseAsString, parseAsArrayOf, createLoader, parseAsStringLiteral } from "nuqs/server";
import { CURATED, sortValues } from "./constants";

const params = {
  sort: parseAsStringLiteral(sortValues).withDefault(CURATED),
  // add default values to clear the query params cleanly from the url
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

// for parsing/reading params server-side
export const loadProductFilters = createLoader(params);
