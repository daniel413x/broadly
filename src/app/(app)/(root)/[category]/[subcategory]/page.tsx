import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import ProductList, { ProductListSkeleton } from "@/modules/products/ui/components/ProductList";

interface SubcategoryPageProps {
  params: Promise<{
    subcategory: string;
  }>;
}

const SubcategoryPage = async ({
  params,
}: SubcategoryPageProps) => {
  const { subcategory } = await params;
  const queryClient = getQueryClient();
  // fetch products data server-side
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
    })
  );
  return (
    <main>
      <h1>
        {"category"}
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList category={subcategory} />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
};

export default SubcategoryPage;
