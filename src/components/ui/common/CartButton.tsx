"use client";

import { useCart } from "@/modules/checkout/hooks/useCart";
import { Button } from "./shadcn/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LIBRARY_ROUTE } from "@/lib/data/routes";
import Link from "next/link";

interface CartButtonProps {
  tenantSlug: string;
  productId: string;
}

const CartButton = ({
  tenantSlug,
  productId,
}: CartButtonProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({
    id: productId,
  }));
  const {
    id,
    isPurchased,
  } = data;
  const cart = useCart(tenantSlug);
  return isPurchased ? (
    <Button
      variant="elevated"
      asChild
      className="flex-1 font-medium bg-gray-50"
    >
      <Link
        prefetch
        href={`/${LIBRARY_ROUTE}/${id}`}
        className=""
      >
        View in Library
      </Link>
    </Button>
  ) : (
    <Button
      variant="elevated"
      className="flex-1 bg-pink-400"
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};

export default CartButton;
