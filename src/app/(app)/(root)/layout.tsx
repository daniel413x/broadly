import configPromise from "@payload-config";
import { getPayload } from "payload";
import { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import { Metadata } from "next";
import Footer from "./_components/Footer";
import SearchFilters from "./search-filters";
import { Category } from "@/payload-types";

export const metadata: Metadata = {
  title: "Home",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({
  children,
}: RootLayoutProps) => {
  const payload = await getPayload({
    config: configPromise,
  });
  const data = await payload.find({
    collection: "categories",
    depth: 1,
    // there should never be too many categories to justify pagination
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });
  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // Payload does not have type safety fully implemented yet
      // with depth: 1 you can be confident that docs will be of type Category
      ...(doc as Category),
    })),
  }));
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <aside aria-label="Search bar">
        <SearchFilters data={formattedData} />
      </aside>
      <div className="flex-1 bg-[#F4F4F0]">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
