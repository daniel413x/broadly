import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadProductFilters } from "@/modules/products/searchParams";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { DEFAULT_LIMIT } from "@/lib/data/constants";

interface RootPageProps {
  searchParams: Promise<SearchParams>;
}

const RootPage = async ({
  searchParams,
}: RootPageProps) => {
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  // fetch products data server-side
  // in child components, access prefetched data with useSuspenseInfiniteQuery
  // NOT useSuspenseQuery!
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <main>
      <h1>
        {"root page"}
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListView />
      </HydrationBoundary>
    </main>
  );
};

export default RootPage;
