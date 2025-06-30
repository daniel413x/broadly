import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadProductFilters } from "@/modules/products/searchParams";
import ProductListView from "@/modules/products/ui/views/ProductListView";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const CategoryPage = async ({
  params,
  searchParams,
}: CategoryPageProps) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  // fetch products data server-side
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...filters,
    })
  );
  return (
    <main>
      <h1>
        {"category"}
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListView category={category} />
      </HydrationBoundary>
    </main>
  );
};

export default CategoryPage;
