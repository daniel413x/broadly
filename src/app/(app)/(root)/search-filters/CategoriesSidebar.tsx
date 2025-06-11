import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/common/shadcn/sheet";
import { CategoriesGetManyOutput } from "@/lib/data/types";
import { useTRPC } from "@/trpc/client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoriesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoriesSidebar = ({
  open,
  onOpenChange,
}: CategoriesSidebarProps) => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.categories.getMany.queryOptions());
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoriesGetManyOutput[1] | null>(null);
  // if there are parent categories, show those, otherwise, show root categories
  const currentCategories = parentCategories ?? data ?? [];
  const handleOpenChange = (bool: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(bool);
  };
  const handleCategoryClick = (cat: CategoriesGetManyOutput[1]) => {
    if (cat.subcategories && cat.subcategories.length > 0) {
      setParentCategories(cat.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(cat);
    } else {
      // this is a leaf category/no subcategories
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${cat.slug}`);
      } else {
        if (cat.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${cat.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };
  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };
  const backgroundColor = selectedCategory?.color || "white";
  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
    >
      <SheetContent
        className="p-0 transition-none"
        side="left"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>
            Categories
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow overflow-y-auto h-full pb-2">
          {!parentCategories ? null : (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((cat) => {
            const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
            return (
              <button
                key={cat.slug}
                className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.name}
                {!hasSubcategories ? null : (
                  <ChevronRight />
                )}
              </button>
            );
          })}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CategoriesSidebar;
