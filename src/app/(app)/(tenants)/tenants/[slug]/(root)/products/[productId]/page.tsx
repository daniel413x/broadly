import ProductView, { ProductViewSkeleton } from "@/modules/products/ui/views/ProductView";
import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface ProductIdPageProps {
  params: Promise<{ productId: string; slug: string; }>;
}

const ProductIdPage = async ({
  params,
}: ProductIdPageProps) => {
  const { productId, slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({
    slug,
  }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductIdPage;
