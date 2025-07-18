"use client";

import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import { useState } from "react";

interface StarPickerProps {
  value?: number;
  className?: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

const StarPicker = ({
  value = 0,
  className = "",
  disabled = false,
  onChange,
}: StarPickerProps) => {
  const [hoverValue, setHoverValue] = useState(0);
  return (
    <div className={cn("flex items-center", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button type="button" className={cn("p-0.5 transition", {
          "cursor-pointer hover:scale-110": !disabled,
          "pointer-events-none": disabled,
        })} onClick={() => onChange?.(star)} key={star} onMouseEnter={() => setHoverValue(star)} onMouseLeave={() => setHoverValue(0)}>
          <StarIcon
            className={cn(
              "size-5",
              (hoverValue || value) >= star ? "fill-black stroke-black" : "stroke-black"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarPicker;
