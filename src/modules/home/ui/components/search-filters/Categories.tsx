"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import CategoryDropdown from "./CategoryDropdown";
import { Button } from "@/components/ui/common/shadcn/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import CategoriesSidebar from "./CategoriesSidebar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const Categories = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const categories = data || [];
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(categories.length);
  const [isAnyHovered, setIsAnyHovered] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const dataByVisibleCount = categories.slice(0, visibleCount);
  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";
  const activeCategoryIndex = categories.findIndex((cat) => cat.slug === activeCategory);
  const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;
  // dynamically slice the fetched catagory array according to a calculation of the total width of the items
  // and whether they will fit into their container
  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
        return;
      }
      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;
      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;
      for (const item of items) {
        const width = item.getBoundingClientRect().width;
        if (totalWidth + width > availableWidth) {
          break;
        }
        totalWidth += width;
        visible = visible + 1;
      }
      setVisibleCount(visible);
    };
    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);
    return () => resizeObserver.disconnect();
  }, [categories.length]);
  const containerOnMouseEnter = () => {
    setIsAnyHovered(true);
  };
  const containerOnMouseLeave = () => {
    setIsAnyHovered(false);
  };
  const toggleIsSidebarOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="relative w-full">
      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={toggleIsSidebarOpen}
      />
      {/* helper ref */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}
      </div>
      {/* visible items */}
      <div
        className="flex flex-nowrap items-center"
        ref={containerRef}
        onMouseEnter={containerOnMouseEnter}
        onMouseLeave={containerOnMouseLeave}
      >
        {/* TODO: hardcode "All" button */}
        {dataByVisibleCount.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}
        <div
          ref={viewAllRef}
          className="shrink-0"
        >
          <Button
            className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              {
                "bg-white border-primary": isActiveCategoryHidden && !isAnyHovered,
              })}
            onClick={() => setIsSidebarOpen(true)}
            variant="elevated"
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
