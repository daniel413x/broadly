import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const Footer = () => {
  return (
    <footer className="border-t font-medium bg-white">
      <div className="gap-2 max-w-(--breakpoint-xl) mx-auto flex items-center h-full py-4 lg:-py-12">
        <p>
          Powered by
        </p>
        <Link
          href="/"
          className={cn("font-semibold text-2xl", poppins.className)}
        >
          broadly
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
