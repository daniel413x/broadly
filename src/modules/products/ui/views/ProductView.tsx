"use client";

// TODO: implement ratings

import { Fragment, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import Link from "next/link";
import StarRating from "@/components/ui/common/StarRating";
import { Button } from "@/components/ui/common/shadcn/button";
import { CheckCheckIcon, LinkIcon, StarIcon } from "lucide-react";
import { Progress } from "@/components/ui/common/shadcn/progress";
import { toast } from "sonner";
import { defaultJSXConverters, RichText } from "@payloadcms/richtext-lexical/react";

const CartButtonLoading = () => {
  return (
    <Button disabled className="flex-1 bg-pink-400">
      Add to cart
    </Button>
  );
};

// solve hydration for CartButton as there is conditional rendering based on the user's cart
const CartButton = dynamic(() => import("@/components/ui/common/CartButton"), {
  ssr: false,
  loading: CartButtonLoading,
});

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}

const ProductView = ({
  productId,
  tenantSlug,
}: ProductViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({
    id: productId,
  }));
  const {
    name,
    price,
    image,
    tenant,
    description,
    refundPolicy,
    reviewRating,
    reviewCount,
    ratingDistribution,
  } = data;
  const tenantImageUrl = tenant?.image?.url;
  const tenantName = tenant?.name;
  const formattedPrice = formatCurrency(price);
  const noRefunds = refundPolicy === "no-refunds";
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const handleClipboardClick = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product link copied to clipboard");
    setTimeout(() => {
      setIsCopied(false);
    }, 750);
  };
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            alt={name}
            fill
            src={image?.url || "/product-card-placeholder.png"}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">
                {name}
              </h1>
            </div>
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="px-2 py-1 border bg-pink-400 w-fit">
                  <p className="text-base font-medium">
                    {formattedPrice}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link href={`${generateTenantURL(tenantSlug)}`} className="flex items-center gap-2">
                  {!tenantImageUrl ? null :(
                    <Image
                      src={tenantImageUrl}
                      alt={name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-[20px]"
                    />
                  )}
                  <p className="text-base underline font-medium">
                    {tenantName}
                  </p>
                </Link>
              </div>
              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-1">
                  <StarRating
                    rating={reviewRating}
                    iconClassName="size-4"
                  />
                </div>
              </div>
            </div>
            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-2.5">
                <StarRating
                  rating={reviewRating}
                  iconClassName="size-4"
                />
                <p className="text-base font-medium">
                  {reviewCount}
                  {" "}
                  rating
                  {reviewCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <div className="p-6">
              {!description ? (
                <p className="font-medium text-muted-foreground italic">
                  No description provided
                </p>
              ) : (
                // some formatting such as headers will not work without using converters
                <RichText data={description} converters={defaultJSXConverters} />
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-2">
                  <CartButton
                    productId={productId}
                    tenantSlug={tenantSlug}
                  />
                  <Button
                    className="size-12"
                    variant="elevated"
                    onClick={handleClipboardClick}
                    disabled={isCopied}
                  >
                    {isCopied ? <CheckCheckIcon /> : <LinkIcon />}
                  </Button>
                </div>
                <p className="text-center font-medium">
                  {noRefunds ? "No refunds" : `${refundPolicy} money back guarantee`}
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">
                    Ratings
                  </h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>
                      ({reviewRating})
                    </p>
                    <p className="text-base">
                      {reviewCount} rating
                      {reviewCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium">
                        {stars} {stars === 1 ? "star" : "stars"}
                      </div>
                      <Progress
                        value={ratingDistribution[stars]}
                        className="h-[1lh]"
                      />
                      <div className="font-medium">
                        {ratingDistribution[stars]}%
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            alt=""
            fill
            src={ "/product-card-placeholder.png"}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductView;
