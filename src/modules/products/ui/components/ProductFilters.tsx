"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { ReactElement, useState } from "react";
import PriceFilter from "./PriceFilter";
import TagsFilter from "./TagsFilter";
import { useProductFilters } from "@/modules/products/hooks/useProductFilters";

interface ProductFilterProps {
  title: string;
  children: ReactElement;
  className?: string;
}

const ProductFilter = ({
  title,
  children,
  className,
}: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;
  return (
    <div className={cn(
      "p-4 border-b flex flex-col gap-2",
      className
    )}>
      <button
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((current) => !current)}
      >
        <p className="font-medium">
          {title}
        </p>
        <Icon className="size-5" />
      </button>
      {isOpen ? children : null}
    </div>
  );
};

const ProductFilters = () => {
  // in useProductFilters, we use nuqs useQueryStates
  // input handlers update query params automatically
  const [filters, setFilters] = useProductFilters();
  // boolean to show/hide the clear button
  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "string") {
      return true;
    }
    return value !== null;
  });
  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };
  // dynamically set any number of filters to null, clearing all filters
  const handleClickOnClear = () => {
    const resetObject = 
    Object.fromEntries(
      Object.keys(filters).map((key) => [key, null])
    );
    setFilters(resetObject);
  };
  const handleOnMinPriceChange = (value: string) => {
    onChange("minPrice", value);
  };
  const handleOnMaxPriceChange = (value: string) => {
    onChange("maxPrice", value);
  };
  const handleOnTagsChange = (value: string[]) => {
    onChange("tags", value);
  };
  return (
    <div className="border rounded-md bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">
          Filters
        </p>
        {!hasAnyFilters ? null : (
          <button className="underline" onClick={handleClickOnClear} type="button">
            Clear
          </button>
        )}
      </div>
      <ProductFilter
        title="Price"
      >
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={handleOnMinPriceChange}
          onMaxPriceChange={handleOnMaxPriceChange}
        />
      </ProductFilter>
      <ProductFilter
        title="Tags"
        className="border-b-0"
      >
        <TagsFilter
          value={filters.tags}
          onChange={handleOnTagsChange}
        />
      </ProductFilter>
    </div>
  );
};

export default ProductFilters;
