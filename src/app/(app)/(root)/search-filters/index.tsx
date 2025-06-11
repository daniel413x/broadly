"use client";

import Categories from "./Categories";
import SearchInput from "./SearchInput";

const SearchFilters = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        // TODO: make dynamic
        backgroundColor: "#F5F5F5",
      }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories />
      </div>
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
