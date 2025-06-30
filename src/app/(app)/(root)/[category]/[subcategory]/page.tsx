import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { loadProductFilters } from "@/modules/products/searchParams";
import { SearchParams } from "nuqs/server";

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
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
      ...filters,
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
