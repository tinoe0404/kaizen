import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/content/site";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen flex flex-col font-body bg-bone text-ink antialiased">
        {/* Sticky skip link */}
        <a
          href="#main-content"
          className="sticky top-0 z-50 sr-only focus:not-sr-only focus:block focus:w-full focus:bg-sun focus:text-ink focus:text-center focus:py-3 focus:px-4 focus:font-heading focus:font-semibold focus:outline-none focus:ring-2 focus:ring-ink"
        >
          Skip to content
        </a>

        <Header />

        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
