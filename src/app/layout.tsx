import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "श्री तसर्पु साना किसान कृषि सहकारी संस्था लि | Shri Tasarpoo Small Farmers Agricultural Cooperative Ltd.",
  description: "Supporting small farmers in Thakre-4 Bahunasthan, Dhading with low-interest agricultural loans, modern farming training, and quality seeds distribution. थाक्रे -४ बहुनस्थन, धादिङ्गका साना किसानहरूको विकासमा समर्पित।",
  keywords: ["agriculture", "cooperative", "farmers", "Dhading", "Thakre", "Nepal", "agricultural loans", "farming training", "seeds distribution", "कृषि", "सहकारी", "किसान", "धादिङ्ग", "थाक्रे", "नेपाल", "कृषि कर्जा", "खेती तालिम", "बिउ वितरण"],
  authors: [{ name: "Shri Tasarpoo Small Farmers Agricultural Cooperative Ltd." }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "श्री तसर्पु साना किसान कृषि सहकारी संस्था लि",
    description: "Supporting small farmers with agricultural loans, training, and quality seeds in Dhading, Nepal",
    url: "https://tasarpoo-cooperative.com.np",
    siteName: "Shri Tasarpoo Cooperative",
    type: "website",
    locale: "ne_NP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shri Tasarpoo Small Farmers Agricultural Cooperative",
    description: "Empowering small farmers in Dhading, Nepal with agricultural support services",
  },
  alternates: {
    canonical: "https://tasarpoo-cooperative.com.np",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
