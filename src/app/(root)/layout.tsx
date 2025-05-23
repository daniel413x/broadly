import { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import { Metadata } from "next";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "Home",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({
  children,
}: RootLayoutProps) => {
  console.log();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#F4F4F0]">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
