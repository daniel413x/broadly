"use client";

import { Input } from "@/components/ui/common/shadcn/input";
import { Label } from "@/components/ui/common/shadcn/label";
import { ChangeEvent } from "react";

export const formatAsCurrency = (value: string | number) => {
  const numericValue = value.toString().replace(/[^0-9.]/g, "");
  const parts = numericValue.split(".");
  const formattedValue = parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "");
  if (!formattedValue) return "";
  const numberValue = parseFloat(formattedValue);
  if (isNaN(numberValue)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

interface PriceFilterProps {
  minPrice?: string | number | null;
  maxPrice?: string | number | null;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
}

const PriceFilter = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceFilterProps) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numbericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMinPriceChange(numbericValue);
  };
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numbericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMaxPriceChange(numbericValue);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">
          Minimum Price
        </Label>
        <Input
          type="text"
          placeholder="$0"
          value={minPrice ? formatAsCurrency(minPrice) : ""}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">
          Maximum Price
        </Label>
        <Input
          type="text"
          placeholder="∞"
          value={maxPrice ? formatAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
