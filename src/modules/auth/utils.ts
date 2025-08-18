import { cookies as getCookies } from "next/headers";

interface GenerateAuthCookieProps {
  prefix: string;
  value: string;
}

export const generateAuthCookie = async ({
  prefix,
  value,
}: GenerateAuthCookieProps) => {
  const cookies = await getCookies();
  cookies.set({
    name: `${prefix}-token`,
    value,
    httpOnly: true,
    path: "/",
    // enable auth flow to function normally in development
    // note that subdomain functionality in development will not work
    // e.g. if
    // NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING
    // is true
    ...(process.env.NODE_ENV === "production" && {
      sameSite: "none",
      domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      secure: true,
    }),
  });
};
