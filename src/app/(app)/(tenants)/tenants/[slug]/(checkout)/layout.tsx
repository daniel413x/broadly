import Footer from "@/modules/tenants/ui/components/Footer";
import Navbar from "@/modules/checkout/ui/components/Navbar";
import { ReactElement } from "react";

interface layoutProps {
  children: ReactElement;
  params: Promise<{ slug: string; }>;
}

const layout = async ({
  children,
  params,
}: layoutProps) => {
  const { slug } = await params;
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      <Navbar slug={slug} />
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
