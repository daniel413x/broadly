import { NextRequest, NextResponse } from "next/server";
import { TENANTS_ROUTE } from "./lib/data/routes";

export const config = {
  matcher: [
    /*
      Match all routes except for the following:
      1. /api (API routes)
      2. /_next (Next.js static files)
      3. /_static (inside /public)
      4. all root files inside /public (e.g. /favicon.ico)
    */
    "/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";
  // "something.broadly.com" or "broadly.com"
  if (hostname.endsWith(`.${rootDomain}`)) {
    const tenantSlug = hostname.replace(`.${rootDomain}`, "");
    return NextResponse.rewrite(new URL(`/${TENANTS_ROUTE}/${tenantSlug}${url.pathname}`, req.url));
  }
  return NextResponse.next();
}
