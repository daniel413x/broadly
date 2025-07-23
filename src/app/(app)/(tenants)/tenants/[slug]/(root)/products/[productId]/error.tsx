"use client";

import { TriangleAlertIcon } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <TriangleAlertIcon />
        <p className="text-base font-medium">
          No product found. If a product was previously found at this URI, the seller may have toggled off its visibility.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
