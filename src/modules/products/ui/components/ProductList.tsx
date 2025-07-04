"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useProductFilters } from "@/modules/products/hooks/useProductFilters";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { DEFAULT_LIMIT } from "@/lib/data/constants";
import { Button } from "@/components/ui/common/shadcn/button";
import { InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductListProps {
  category?: string;
  tenantSlug?: string;
  narrowView?: boolean;
}

const gridStyles = (narrowView?: boolean) => cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4", {
  "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3": narrowView,
});

const ProductList = ({ category, narrowView, tenantSlug }: ProductListProps) => {
  const trpc = useTRPC();
  const [filters] = useProductFilters();
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    // in page.tsx, prefetching must be done with prefetchInfiniteQuery and not prefetchQuery
  } = useSuspenseInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    category,
    tenantSlug,
    limit: DEFAULT_LIMIT,
  },
  {
    getNextPageParam: (lastPage) => {
      return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
    },
  }
  ));
  const handleOnClickNextPage = () => {
    fetchNextPage();
  };
  const noProductsFound = data.pages?.[0]?.docs.length === 0;
  if (noProductsFound) {
    return (
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">
          No products found
        </p>
      </div>
    );
  }
  return (
    <>
      <ul className={gridStyles(narrowView)}>
        {data?.pages.flatMap((page) => page.docs).map((product) => (
          <li key={product.id}>
            <ProductCard
              id={product.id}
              name={product.name}
              tenantUsername={product.tenant?.name}
              tenantImageUrl={product.tenant.image?.url}
              reviewCount={50}
              reviewRating={3}
              /*
                the tprc query return must be modified for image.url to be accessible
                see ../../server/procedures.ts
              */
              imageUrl={product.image?.url}
              price={product.price}
            />
          </li>
        ))}
      </ul>
      <div className="flex justify-center pt-8">
        {!hasNextPage ? null : (
          <Button 
            className="font-medium disabled:opacity-50 text-base bg-white"
            onClick={handleOnClickNextPage}
            disabled={isFetchingNextPage}
            variant="elevated"
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

export default ProductList;

export const ProductListSkeleton = ({
  narrowView,
}: ProductListProps) => {
  const skeletons = Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
    <ProductCardSkeleton key={index} />
  ));
  return (
    <div className={gridStyles(narrowView)}>
      {skeletons}
    </div>
  );
};
