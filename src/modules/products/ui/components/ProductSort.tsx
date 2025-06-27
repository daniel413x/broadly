"use client";

import { useProductFilters } from "@/modules/products/hooks/useProductFilters";
import { CURATED, HOT_AND_NEW, TRENDING } from "@/modules/products/constants";
import { Button } from "@/components/ui/common/shadcn/button";
import { cn } from "@/lib/utils";

const ProductSort = () => {
  const [filters, setFilters] = useProductFilters();
  const isNotSortedByCurated = filters.sort !== CURATED;
  const isNotSortedByTrending = filters.sort !== TRENDING;
  const isNotSortedByHotAndNew = filters.sort !== HOT_AND_NEW;
  const handleSetToCurated = () => {
    setFilters({ sort: CURATED });
  };
  const handleSetToTrending = () => {
    setFilters({ sort: TRENDING });
  };
  const handleSetToHotAndNew = () => {
    setFilters({ sort: HOT_AND_NEW });
  };
  return (
    <div 
      className="flex items-center justify-between cursor-pointer relative">
      <Button
        size="sm"
        variant="secondary"
        onClick={handleSetToCurated}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          {
            "bg-transparent border-transparent hover:border-border hover:bg-transparent": isNotSortedByCurated,
          }
        )}
      >
        Curated
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleSetToTrending}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          {
            "bg-transparent border-transparent hover:border-border hover:bg-transparent": isNotSortedByTrending,
          }
        )}
      >
        Trending
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleSetToHotAndNew}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          {
            "bg-transparent border-transparent hover:border-border hover:bg-transparent": isNotSortedByHotAndNew,
          }
        )}
      >
        Hot &amp; New
      </Button>
    </div>
  );
};

export default ProductSort;
