import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CheckoutItemProps {
  id: string;
  isLast?: boolean;
  imageUrl?: string | null;
  name: string;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  onRemove: (productId: string) => void;
  price: number;
}

const CheckoutItem = ({
  id,
  isLast = false,
  imageUrl = null,
  name,
  productUrl,
  tenantUrl,
  tenantName,
  onRemove,
  price,
}: CheckoutItemProps) => {
  const handleOnClickRemove = () => {
    onRemove(id);
  };
  return (
    <div className={cn("grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b", {
      "border-b-0": isLast,
    })}>
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image
            src={imageUrl || "/product-card-placeholder.png"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="py-4 flex flex-col justify-between">
        <div>
          <Link href={productUrl}>
            <h4 className="font-bold underline ">
              {name}
            </h4>
          </Link>
          <Link href={tenantUrl}>
            <p className="font-medium underline ">
              {tenantName}
            </p>
          </Link>
        </div>
      </div>
      <div className="py-4 flex flex-col justify-between">
        <p className="font-medium">
          {formatCurrency(price)}
        </p>
        <button type="button" className="underline font-medium cursor-pointer" onClick={handleOnClickRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CheckoutItem;
