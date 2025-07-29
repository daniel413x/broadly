import { Button } from "@/components/ui/common/shadcn/button";
import { useCart } from "../../hooks/useCart";
import { cn, generateTenantURL } from "@/lib/utils";
import Link from "next/link";
import { CHECKOUT_ROUTE } from "@/lib/data/routes";
import { ShoppingCartIcon } from "lucide-react";

interface CheckoutButtonProps {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
}

const CheckoutButton = ({
  className = "",
  hideIfEmpty = false,
  tenantSlug,
}: CheckoutButtonProps) => {
  const { totalItems } = useCart(tenantSlug);
  if (hideIfEmpty && totalItems === 0) {
    return null;
  }
  let ariaLabel = "";
  if (totalItems === 1) {
    ariaLabel = "Your cart. There is 1 item added.";
  } else if (totalItems > 1) {
    ariaLabel = `Your cart. There are ${totalItems} items added.`;
  } else {
    ariaLabel = "Your cart. There are no items added.";
  }
  return (
    <Button data-testid="checkout-button" variant="elevated" asChild className={cn("bg-white", className)} aria-label={ariaLabel}>
      <Link href={`${generateTenantURL(tenantSlug)}/${CHECKOUT_ROUTE}`}>
        <ShoppingCartIcon data-testid="checkout-button-shoppingcart-icon" />
        {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
};

export default CheckoutButton;
