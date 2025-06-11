import { ReactNode, Suspense } from "react";
import Navbar from "./_components/Navbar";
import { Metadata } from "next";
import Footer from "./_components/Footer";
import SearchFilters, { SearchFiltersLoading } from "./search-filters";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Home",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({
  children,
}: RootLayoutProps) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions()
  );
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <aside aria-label="Search bar">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<SearchFiltersLoading />}>
            <SearchFilters />
          </Suspense>
        </HydrationBoundary>
      </aside>
      <div className="flex-1 bg-[#F4F4F0]">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
