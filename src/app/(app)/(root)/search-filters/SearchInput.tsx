"use client";

import { Input } from "@/components/ui/common/shadcn/input";
import { NoDocCategory } from "@/lib/data/types";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import CategoriesSidebar from "./CategoriesSidebar";
import { useState } from "react";
import { Button } from "@/components/ui/common/shadcn/button";

interface SearchInputProps {
  disabled?: boolean;
  data: NoDocCategory[];
}

const SearchInput = ({
  disabled,
  data,
}: SearchInputProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar
        data={data}
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
      {/* TODO: add library button */}
    </div>
  );
};

export default SearchInput;
