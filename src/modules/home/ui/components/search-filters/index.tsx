"use client";

import { useTRPC } from "@/trpc/client";
import Categories from "./Categories";
import SearchInput from "./SearchInput";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DEFAULT_BACKGROUND_COLOR } from "@/modules/home/constants";
import BreadcrumbsNavigation from "./BreadcrumbsNavigation";

const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const params = useParams();
  // get category attributes
  const categoryParam = params.category || undefined;
  const activeCategorySlug = categoryParam as string || "all";
  const activeCategory = data.find((category) => category.slug === activeCategorySlug);
  const activeCategoryColor = activeCategory?.color || DEFAULT_BACKGROUND_COLOR;
  const activeCategoryName = activeCategory?.name || null;
  // get subcategory attributes
  const subcategoryParam = params.subcategory as string | undefined;
  const activeSubcategoryName = activeCategory?.subcategories?.find((subcategory) => subcategory.slug === subcategoryParam)?.name || null;
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: activeCategoryColor,
      }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories />
      </div>
      <BreadcrumbsNavigation
        activeCategorySlug={activeCategorySlug}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  );
};

export default SearchFilters;

export const SearchFiltersLoading = () => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={
      {
        backgroundColor: "#F5F5F5",
      }
    }>
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
