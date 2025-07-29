"use client";

import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../hooks/useCart";
import { useEffect } from "react";
import { generateTenantURL } from "@/lib/utils";
import CheckoutItem from "../components/CheckoutItem";
import CheckoutSidebar from "../components/CheckoutSidebar";
import NoProductsFound from "@/components/ui/common/NoProductsFound";
import { LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/useCheckoutStates";
import { useRouter } from "next/navigation";
import { LIBRARY_ROUTE, SIGN_IN_ROUTE } from "@/lib/data/routes";

interface CheckoutViewProps {
  tenantSlug: string;
}

const wrapperStyles = "lg:pt-16 pt-4 px-4 lg:px-12";

const CheckoutView = ({
  tenantSlug,
}: CheckoutViewProps) => {
  const router = useRouter();
  const { productIds, clearCart, removeProduct } = useCart(tenantSlug);
  const queryClient = useQueryClient();
  const [states, setStates] = useCheckoutStates();
  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(trpc.checkout.getProducts.queryOptions({
    ids: productIds,
  }));
  const purchase = useMutation(trpc.checkout.purchase.mutationOptions({
    onMutate: () => {
      // reset state initially
      setStates({ success: false, cancel: false });
    },
    onSuccess: (res) => {
      window.location.href = res.url;
    },
    onError: (e) => {
      if (e?.data?.code === "UNAUTHORIZED") {
        // TODO: finish when subdomains enabled
        router.push(`/${SIGN_IN_ROUTE}`);
      }
      toast.error(e.message);
    },
  }));
  useEffect(() => {
    if (states.success) {
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      router.push(`/${LIBRARY_ROUTE}`);
    }
  }, [states.success, clearCart, router, queryClient, trpc.library.getMany]);
  useEffect(() => {
    if (!error) {
      return;
    }
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, cart cleared");
    }
  }, [error, clearCart]);
  const onRemoveProduct = (productId: string) => {
    removeProduct(productId);
  };
  if (isLoading) {
    return (
      <div className={wrapperStyles} data-testid="loading-wrapper">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }
  const noProductsFound = !isLoading && (!data || data?.docs.length === 0);
  if (noProductsFound) {
    return (
      <div className={wrapperStyles} data-testid="no-products-found-wrapper">
        <NoProductsFound />
      </div>
    );
  }
  const handleOnCheckout = () => {
    purchase.mutate({
      tenantSlug,
      productIds,
    });
  };
  return (
    <div className={wrapperStyles} data-testid="products-found-wrapper">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, i) => (
              <CheckoutItem
                key={product.id}
                id={product.id}
                isLast={i === data.docs.length - 1}
                imageUrl={product.image?.url || "/product-card-placeholder.png"}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={`${generateTenantURL(product.tenant.slug)}`}
                tenantName={product.tenant.name}
                onRemove={onRemoveProduct}
                price={product.price}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice}
            onCheckout={handleOnCheckout}
            isCanceled={states.cancel}
            isPending={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
