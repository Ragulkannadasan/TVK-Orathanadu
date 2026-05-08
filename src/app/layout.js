import "./globals.css";
import { auth } from "@/auth";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const metadata = {
  title: 'TVK Orathanadu – தமிழக வெற்றி கழகம் | ஓரத்தநாடு தொகுதி 175',
  description:
    'Thamizhaga Vetri Kazhagam – Orathanadu Assembly Constituency 175. Digital voter enrollment, grievance redressal, and booth-level management for TVK members.',
  keywords: 'TVK, Thamizhaga Vetri Kazhagam, Orathanadu, Tamil Nadu, voter enrollment, grievance',
};

export const viewport = {
  themeColor: '#800000',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="ta">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <SessionProviderWrapper session={session}>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
