import Footer from "@/modules/tenants/ui/components/Footer";
import Navbar, { NavbarSkeleton } from "@/modules/tenants/ui/components/Navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReactElement, Suspense } from "react";

interface layoutProps {
  children: ReactElement;
  params: Promise<{ slug: string; }>;
}

const layout = async ({
  children,
  params,
}: layoutProps) => {
  const { slug } = await params;
  const queryClient = getQueryClient();
  // fetch categories data server-side
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      <HydrationBoundary state={dehydrate(queryClient)} >
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />      
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default layout;
