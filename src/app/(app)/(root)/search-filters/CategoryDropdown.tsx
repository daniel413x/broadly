"use client";

import { Button } from "@/components/ui/common/shadcn/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import useDropdownPosition from "./hooks/useDropdownPosition";
import SubcategoryMenu from "./SubcategoryMenu";
import { CategoriesGetManyOutput } from "@/lib/data/types";
import Link from "next/link";

interface CategoryDropdownProps {
  category: CategoriesGetManyOutput[1];
  isActive: boolean;
  isNavigationHovered: boolean;
}

const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    getDropdownPosition,
  } = useDropdownPosition(dropdownRef);
  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };
  const onMouseLeave = () => {
    setIsOpen(false);
  };
  const renderPointer = category.subcategories && category.subcategories.length;
  const dropdownPosition = getDropdownPosition();
  // TODO: implement for improving mobile
  // const toggleDropdown = () => {
  //   if (category.subcategories?.docs?.length) {
  //     setIsOpen(!isOpen);
  //   }
  // };
  return (
    <div
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // onClick={toggleDropdown}
      data-testid="category-dropdown"
    >
      <div className="relative">
        <Button
          data-testid={`${category.slug}-category-dropdown`}
          asChild
          variant="elevated"
          className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            {
              // when on the category page
              "bg-white border-primary": isActive && !isNavigationHovered,
              // when hovering
              "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] ": isOpen,
            })}
        >
          <Link
            href={`/${category.slug === "all" ? "" : category.slug}`}
          >
            {category.name}
          </Link>
        </Button>
        {/* triangle */}
        {!renderPointer ? null : (
          <div className={cn("opacity-0 absolute -bottom-3 w-0 h-0 border-l-transparent border-r-transparent border-b-black border-b-[10px] border-l-[10px]  border-r-[10px] left-1/2 -translate-x-1/2", {
            "opacity-100": isOpen,
          })} />
        )}
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
};

export default CategoryDropdown;
