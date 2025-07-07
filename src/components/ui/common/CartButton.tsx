"use client";

import { useCart } from "@/modules/checkout/hooks/useCart";
import { Button } from "./shadcn/button";

interface CartButtonProps {
  tenantSlug: string;
  productId: string;
}

const CartButton = ({
  tenantSlug,
  productId,
}: CartButtonProps) => {
  const cart = useCart(tenantSlug);
  return (
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
