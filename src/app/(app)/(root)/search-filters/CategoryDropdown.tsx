"use client";

import { Button } from "@/components/ui/common/shadcn/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import useDropdownPosition from "./hooks/useDropdownPosition";
import SubcategoryMenu from "./SubcategoryMenu";
import { NoDocCategory } from "@/lib/data/types";

interface CategoryDropdownProps {
  category: NoDocCategory;
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
  return (
    <div
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Button
          variant="elevated"
          className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            {
              "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] ": (isActive && !isNavigationHovered) || isOpen,
            })}
        >
          {category.name}
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
