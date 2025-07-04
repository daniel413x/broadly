"use client";

import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  slug: string;
}

const Navbar = ({
  slug,
}: NavbarProps) => {
  const trpc = useTRPC();
  const { data: tenant } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({
    slug,
  }));
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <Link href={generateTenantURL(slug)} className="flex items-center gap-2">
          {!tenant.image?.url ? null : (
            <Image
              src={tenant.image?.url || "/images/tenant-placeholder.png"}
              alt={slug}
              width={32}
              height={32}
              className="rounded-full border shrink-0 size-[32px]"
            />
          )}
        </Link>
        <p className="text-xl">
          {tenant.name}
        </p>
      </div>
    </nav>
  );
};

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <div />
      </div>
    </nav>
  );
};

export default Navbar;
