import { LIBRARY_ROUTE } from "@/lib/data/routes";
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
  reviewRating: number;
  reviewCount: number;
  price: number;
}

const ProductCard = ({
  id,
  name,
  imageUrl,
  tenantUsername,
  tenantImageUrl,
  reviewRating,
  reviewCount,
}: ProductCardProps) => {
  const showReviews = reviewCount > 0;
  return (
    <div>
      <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
        <Link
          className="relative aspect-square"
          aria-label={`Go to the product page for ${name}`}
          href={`/${LIBRARY_ROUTE}/${id}`}
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
          <div
            className="flex items-center gap-2 z-20"
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
          </div>
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
