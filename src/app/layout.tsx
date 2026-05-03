import type { Metadata } from "next";
import Script from "next/script";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"
import ConditionalNavbar from "@/components/ConditionalNavbar"
import ConditionalFooter from "@/components/ConditionalFooter"

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Fitore",
  description: "Combat sports gym operations platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body
        className={`${barlow.variable} ${jakarta.variable} antialiased`}
      >
        <ConditionalNavbar>
          <Navbar />
        </ConditionalNavbar>
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
