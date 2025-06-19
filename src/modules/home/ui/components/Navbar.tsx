"use client";

import { Button } from "@/components/ui/common/shadcn/button";
import * as routes from "@/lib/data/routes";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import NavbarSidebar from "./NavbarSidebar";
import { MenuIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({
  href,
  children,
  isActive,
}: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full border-transparent hover:border-primary px-3.5 text-lg", {
          "bg-black text-white hover:bg-black hover:text-white": isActive,
        }
      )}
    >
      <Link
        href={href}
      >
        {children}
      </Link>
    </Button>
  );
};

const navbarItems = [
  {
    href: "/",
    children: "Home",
  },
  {
    href: `/${routes.ABOUT_ROUTE}`,
    children: "About",
  },
  {
    href: `/${routes.FEATURES_ROUTE}`,
    children: "Features",
  },
  {
    href: `/${routes.PRICING_ROUTE}`,
    children: "Pricing",
  },
  {
    href: `/${routes.CONTACT_ROUTE}`,
    children: "Contact",
  },
];

const Navbar = () => {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const toggleOpenSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <nav className="h-20 border-b flex justify-between font-medium bg-white">
      <Link
        href="/"
        className="flex items-center pl-6"
        data-testid="navbar-logo"
      >
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          broadly
        </span>
      </Link>
      <div className="items-center gap-4 hidden lg:flex ">
        {navbarItems.map((item) => (
          <NavbarItem
            href={item.href}
            key={item.href}
            isActive={pathname === item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>
      {!session.data?.user ? (
        <div className="lg:flex hidden">
          <Button
            asChild
            variant="secondary"
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
          >
            <Link
              prefetch
              href={`/${routes.SIGN_IN_ROUTE}`}
            >
              Log in
            </Link>
          </Button>
          <Button
            asChild
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black hover:bg-pink-400 text-white hover:text-black transition-colors text-lg"
          >
            <Link
              prefetch
              href={`/${routes.SIGN_UP_ROUTE}`}
            >
              Start selling
            </Link>
          </Button>
        </div>
      ) : (
        <div className="lg:flex hidden">
          <Button
            asChild
            variant="secondary"
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
          >
            <Link
              href={`/${routes.ADMIN_ROUTE}`}
            >
              Dashboard
            </Link>
          </Button>
        </div>
      )}
      <div className="flex lg:hidden items-center justify-center">
        <Button
          variant="ghost"
          className="size-14 border-transparent"
          onClick={toggleOpenSidebar}
          data-testid="navbar-menu-button"
          aria-label="Open menu"
        >
          <MenuIcon className="size-8" />
        </Button>
      </div>
      <NavbarSidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
    </nav>
  );
};

export default Navbar;
