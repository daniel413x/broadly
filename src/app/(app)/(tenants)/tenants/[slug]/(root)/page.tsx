import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadProductFilters } from "@/modules/products/searchParams";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { DEFAULT_LIMIT } from "@/lib/data/constants";

interface TenantPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

const TenantPage = async ({
  searchParams,
  params,
}: TenantPageProps) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  // fetch products data server-side
  // in child components, access prefetched data with useSuspenseInfiniteQuery
  // NOT useSuspenseQuery!
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <main>
      <h1>
        {"slug page"}
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListView tenantSlug={slug} narrowView />
      </HydrationBoundary>
    </main>
  );
};

export default TenantPage;
