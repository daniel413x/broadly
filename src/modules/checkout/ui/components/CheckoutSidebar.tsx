import { Button } from "@/components/ui/common/shadcn/button";
import { formatCurrency } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";

interface CheckoutSidebarProps {
  total?: number;
  onCheckout: () => void;
  isCanceled?: boolean;
  isPending?: boolean;
}

const CheckoutSidebar = ({
  total,
  onCheckout,
  isCanceled = false,
  isPending = false,
}: CheckoutSidebarProps) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-medium text-lg">
          Total
        </h4>
        {!total ? null : (
          <p className="font-medium text-lg">
            {formatCurrency(total)}
          </p>
        )}
      </div>
      <div className="p-4 flex items-centr justify-center">
        <Button disabled={isPending} size="lg" onClick={onCheckout} variant="elevated" className="text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary">
          Checkout
        </Button>
      </div>
      {!isCanceled ? null : (
        <div className="p-4 flex justify-center items-center border-t">
          <div className="w-full bg-red-100 border-red-400 border font-medium px-4 py-3 rounded flex">
            <div className="flex items-center">
              <CircleXIcon className="size-6 mr-2 fill-red-500 text-red-100" />
              <span>
                Checkout failed. Please try again.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutSidebar;
