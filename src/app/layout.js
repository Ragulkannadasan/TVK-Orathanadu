import "./globals.css";
import { Inter, Noto_Sans_Tamil, Outfit } from "next/font/google";
import { auth } from "@/auth";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import TopLoader from "@/components/TopLoader";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-tamil",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: 'TVK Orathanadu – தமிழக வெற்றி கழகம் | ஒரத்தநாடு தொகுதி 175',
  description:
    'Thamizhaga Vetri Kazhagam – Orathanadu Assembly Constituency 175. Digital voter enrollment, grievance redressal, and booth-level management for TVK members.',
  keywords: 'TVK, Thamizhaga Vetri Kazhagam, Orathanadu, Tamil Nadu, voter enrollment, grievance',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

import ThemeWrapper from "@/components/ThemeWrapper";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html 
      lang="ta" 
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${notoTamil.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen flex flex-col font-sans transition-colors duration-300">
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        <ThemeWrapper>
          <SessionProviderWrapper session={session}>
            {children}
          </SessionProviderWrapper>
        </ThemeWrapper>
      </body>
    </html>
  );
}
