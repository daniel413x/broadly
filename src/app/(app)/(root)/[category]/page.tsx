import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import ProductList, { ProductListSkeleton } from "@/modules/products/ui/components/ProductList";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage = async ({
  params,
}: CategoryPageProps) => {
  const { category } = await params;
  const queryClient = getQueryClient();
  // fetch products data server-side
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
    })
  );
  return (
    <main>
      <h1>
        {"category"}
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList category={category} />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
};

export default CategoryPage;
