import type { Metadata, Viewport } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { TripBar } from "@/components/trip/TripBar";
import { TripProvider } from "@/components/trip/TripProvider";
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

function getSiteUrl(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required in production. Set it in your Vercel environment variables."
    );
  }
  return new URL("http://localhost:3000");
}

const description =
  "Build your trip online and send one booking request. Destinations, activities, lodges and vehicle hire across Southern Africa.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    template: "%s | Kaizen Travel and Adventures",
    default: site.name,
  },
  description,
  openGraph: {
    siteName: site.name,
    locale: "en",
    type: "website",
    description,
  },
  twitter: {
    card: "summary_large_image",
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${sourceSans.variable}`}>
      <body
        style={{ paddingBottom: "var(--trip-bar-h, 0px)" }}
        className="min-h-screen flex flex-col font-body bg-bone text-ink antialiased"
      >
        {/* Sticky skip link */}
        <a
          href="#main-content"
          className="sticky top-0 z-50 sr-only focus:not-sr-only focus:block focus:w-full focus:bg-sun focus:text-ink focus:text-center focus:py-3 focus:px-4 focus:font-heading focus:font-semibold focus:outline-none focus:ring-2 focus:ring-ink"
        >
          Skip to content
        </a>

        <TripProvider>
          <Header />

          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>

          <Footer />
          <TripBar />
          <WhatsAppFloat />
        </TripProvider>
      </body>
    </html>
  );
}
