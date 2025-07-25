"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReviewForm, { ReviewFormSkeleton } from "./ReviewForm";
import { Suspense } from "react";

interface ReviewSidebarProps {
  productId: string;
}

const ReviewSidebar = ({
  productId,
}: ReviewSidebarProps) => {
  const trpc = useTRPC();
  // note in page.tsx there is a prefetch for both the user's library and review
  // prefetching is required for TRPC suspense queries to work properly
  const { data } = useSuspenseQuery(trpc.reviews.getOne.queryOptions({
    productId,
  }));
  return (
    <Suspense fallback={<ReviewFormSkeleton />}>
      <ReviewForm
        productId={productId}
        initialData={data}
      />
    </Suspense>
  );
};

export default ReviewSidebar;
