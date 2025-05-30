import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

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
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
