import { STRIPE_VERIFY_ROUTE } from "@/lib/data/routes";
import Link from "next/link";
import { Button } from "../common/shadcn/button";

const StripeVerify = () => {
  return (
    <Link href={`/${STRIPE_VERIFY_ROUTE}`}>
      <Button>
        Verify Account
      </Button>
    </Link>
  );
};

export default StripeVerify;
