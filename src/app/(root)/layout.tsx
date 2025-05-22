import { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import { Metadata } from "next";

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
      {children}
    </div>
  );
};

export default RootLayout;
