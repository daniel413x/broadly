import { Button } from "@/components/ui/common/shadcn/button";
import { generateTenantURL } from "@/lib/utils";
import Link from "next/link";

interface NavbarProps {
  slug: string;
}

const Navbar = ({
  slug,
}: NavbarProps) => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <p className="text-xl">
          Checkout
        </p>
        <Button variant="elevated" asChild>
          <Link href={`/${generateTenantURL(slug)}`}>
            Continue shopping
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
