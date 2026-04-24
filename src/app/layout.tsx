import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BottomNav, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OtakuHub — Nonton Anime Streaming",
    template: "%s · OtakuHub",
  },
  description:
    "Nonton anime streaming favoritmu dengan subtitle bahasa Indonesia, update harian, ringan di HP.",
  applicationName: "OtakuHub",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OtakuHub",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "OtakuHub",
    title: "OtakuHub — Nonton Anime Streaming",
    description:
      "Nonton anime streaming favoritmu dengan subtitle bahasa Indonesia, update harian, ringan di HP.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0812" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Providers>
          <Navbar />
          <main className="flex flex-1 flex-col pb-20 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
