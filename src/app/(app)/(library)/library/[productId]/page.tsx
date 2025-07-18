export const dynamic = "force-dynamic";

import ProductView from "@/modules/library/ui/views/ProductView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface LibraryPageProps {
  params: Promise<{
    productId: string;
  }>
}

const LibraryPage = async ({
  params,
}: LibraryPageProps) => {
  const { productId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.library.getOne.queryOptions({
    productId,
  }));
  void queryClient.prefetchQuery(trpc.reviews.getOne.queryOptions({
    productId,
  }));
  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductView productId={productId} />
      </HydrationBoundary>
    </main>
  );
};

export default LibraryPage;
