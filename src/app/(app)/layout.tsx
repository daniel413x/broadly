import { ReactNode } from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TRPCReactProvider } from "@/trpc/client";

export const metadata: Metadata = {
  title: {
    default: "broadly",
    template: "%s | broadly",
  },
  // icons: {
  //   icon: [
  //     {
  //       media: '(prefers-color-scheme: light)',
  //       url: '/icon.png',
  //       href: '/icon.png',
  //     },
  //   ],
  // },
};

const dmSans = DM_Sans({
  subsets: ["latin"],
});

function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} antialiased`}
      >
        <NuqsAdapter>
          <TRPCReactProvider >
            {children}          
            <Toaster visibleToasts={1} />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

export default RootLayout;
