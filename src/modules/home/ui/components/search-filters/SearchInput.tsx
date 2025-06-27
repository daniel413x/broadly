"use client";

import { Input } from "@/components/ui/common/shadcn/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import CategoriesSidebar from "./CategoriesSidebar";
import { useState } from "react";
import { Button } from "@/components/ui/common/shadcn/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { LIBRARY_ROUTE } from "@/lib/data/routes";

interface SearchInputProps {
  disabled?: boolean;
}

const SearchInput = ({
  disabled,
}: SearchInputProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input className="pl-8" placeholder="Search products" disabled={disabled} />
      </div>
      <Button
        className="size-12 shrink-0 flex lg:hidden"
        variant="elevated"
        onClick={openSidebar}
      >
        <ListFilterIcon />
      </Button>
      {!session.data?.user ? null : (
        <Button variant="elevated" asChild>
          <Link
            href={`/${LIBRARY_ROUTE}`}
          >
            <BookmarkCheckIcon />
            Library
          </Link>
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
