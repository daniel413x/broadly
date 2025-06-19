import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/common/shadcn/breadcrumb";
import Link from "next/link";

interface BreadcrumbsNavigationProps {
  activeCategorySlug?: string | null;
  activeCategoryName?: string | null;
  activeSubcategoryName?: string | null;
}

const BreadcrumbsNavigation = ({
  activeCategorySlug,
  activeCategoryName,
  activeSubcategoryName,
}: BreadcrumbsNavigationProps) => {
  if (!activeCategoryName || activeCategorySlug === "all") {
    return null;
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {activeSubcategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-xl font-medium underline text-primary">
                <Link href={`/${activeCategorySlug}`}>
                  {activeCategoryName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary font-medium text-lg">
              /
            </BreadcrumbSeparator> 
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xl font-medium">
                {activeSubcategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xl font-medium">
              {activeCategoryName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbsNavigation;
