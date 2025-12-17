import { cookies as getCookies } from "next/headers";

interface GenerateAuthCookieProps {
  prefix: string;
  value: string;
}

const isHttps = process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://");

export const generateAuthCookie = async ({
  prefix,
  value,
}: GenerateAuthCookieProps) => {
  const cookies = await getCookies();
  cookies.set({
    name: `${prefix}-token`,
    value,
    httpOnly: true,
    // enable auth flow to function normally in development
    // note that subdomain functionality in development will not work
    // e.g. if
    // NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING
    // is true
    path: "/",
    ...(isHttps
      ? {
        sameSite: "none",
        secure: true,
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      }
      : {
        sameSite: "lax",
      }),
  });
};
