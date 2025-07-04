import { ScrollArea } from "@/components/ui/common/shadcn/scroll-area";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/common/shadcn/sheet";
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from "@/lib/data/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

interface NavbarSidebarItem {
  href: string;
  children: ReactNode;
}

interface NavbarSidebarProps {
  items: NavbarSidebarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NavbarSidebar = ({
  items,
  open,
  onOpenChange,
}: NavbarSidebarProps) => {
  const buttonStyle = "p-4 w-full text-left hover:bg-black hover:text-white focus:bg-black focus:text-white flex items-center font-medium text-base";
  const onClickLink = () => {
    onOpenChange(false);
  };
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        className="p-0 transition-none"
        side="left"
        data-testid="navbar-sidebar-content"
      >
        <SheetHeader
          className="p-4 border-b"
        >
          <SheetTitle>
            Menu
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={buttonStyle}
                  onClick={onClickLink}
                >
                  {item.children}
                </Link>
              </li>
            ))}
            <li>
              <Link
                className={cn(buttonStyle, "border-t")}
                href={`/${SIGN_IN_ROUTE}`}
                onClick={onClickLink}
              >
                Log in
              </Link>
            </li>
            <li>
              <Link
                className={buttonStyle}
                href={`/${SIGN_UP_ROUTE}`}
                onClick={onClickLink}
              >
                Start selling
              </Link>
            </li>
          </ul>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarSidebar;
