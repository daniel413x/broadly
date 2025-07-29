import { PRODUCTS_ROUTE } from "@/lib/data/routes";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantUsername: string;
  tenantImageUrl?: string | null;
  tenantSlug: string;
  reviewRating: number | string;
  reviewCount: number;
  price: number;
}

const ProductCard = ({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantUsername,
  tenantImageUrl,
  reviewRating,
  reviewCount,
  price,
}: ProductCardProps) => {
  const showReviews = reviewCount > 0;
  const priceAsUsd = formatCurrency(price);
  return (
    <div>
      <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
        <Link
          className="relative aspect-square"
          aria-label={`Go to the product page for ${name}`}
          href={`${generateTenantURL(tenantSlug)}/${PRODUCTS_ROUTE}/${id}`}
        >
          <Image
            alt=""
            fill
            src={imageUrl || "/product-card-placeholder.png"}
            className="object-cover"
          />
        </Link>
        <div className="p-4 border-y flex flex-col gap-3 flex-1">
          <h2 title={name} className="text-lg font-medium line-clamp-4">
            {name}
          </h2>
          <Link
            className="flex items-center gap-2 z-20"
            href={`${generateTenantURL(tenantSlug)}`}
          >
            <Image
              src={tenantImageUrl || "/author-avatar-placeholder.png"}
              alt=""
              width={16}
              height={16}
              className="rounded-full border shrink-0 size-[16px]"
            />
            <p className="text-sm underline font-medium">
              {tenantUsername}
            </p>
          </Link>
          {!showReviews ? null : (
            <div className="flex items-center gap-1">
              <StarIcon
                className="size-3.5 fill-black"
              />
              <p className="text-sm font-medium">
                {reviewRating}
                {" "}
                ({reviewCount})
              </p>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="relative px-2 py-1 border bg-pink-400 w-fit">
            <p className="text-sm font-medium">
              {priceAsUsd}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
  );
};

export default ProductCard;
