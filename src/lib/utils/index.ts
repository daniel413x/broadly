import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// return a url corresponding to the tenant's subdomain such as https://daniel.broadly.com
export function generateTenantURL(tenantSlug: string) {
  let protocol = "https";
  if (process.env.NODE_ENV === "development") {
    protocol = "http";
    // for debugging: uncomment the following line to use non-subdomain URLs
    // return `${process.env.NEXT_PUBLIC_APP_URL}/${TENANTS_ROUTE}/${tenantSlug}`;
  }
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;
  return `${protocol}://${tenantSlug}.${domain}`;
}

export function formatCurrency(
  value: number
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
