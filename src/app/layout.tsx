import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextConnectProvider } from "@/components/providers/NextConnectProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextConnect — Web3 Auth & Wallet Template",
  description:
    "Open-source Next.js template with embedded wallets, smart accounts, and full auth — no vendor lock-in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("nextconnect-theme")||"gruvbox-light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className={inter.className}>
        <NextConnectProvider>
          {children}
          <Toaster />
        </NextConnectProvider>
      </body>
    </html>
  );
}
