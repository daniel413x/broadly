import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { loadProductFilters } from "@/modules/products/searchParams";
import { SearchParams } from "nuqs/server";
import { DEFAULT_LIMIT } from "@/lib/data/constants";

interface SubcategoryPageProps {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const SubcategoryPage = async ({
  params,
  searchParams,
}: SubcategoryPageProps) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  // fetch products data server-side
  // in child components, access prefetched data with useSuspenseInfiniteQuery
  // NOT useSuspenseQuery!
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      category: subcategory,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <main>
      <h1>
        {"subcategory"}
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListView category={subcategory} />
      </HydrationBoundary>
    </main>
  );
};

export default SubcategoryPage;
