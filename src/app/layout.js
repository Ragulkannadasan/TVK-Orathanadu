import "./globals.css";
import { auth } from "@/auth";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import PWARegistration from "@/components/PWARegistration";

export const metadata = {
  title: 'TVK Orathanadu – தமிழக வெற்றி கழகம் | தொகுதி 175',
  description:
    'Thamizhaga Vetri Kazhagam – Orathanadu Assembly Constituency 175. Digital voter enrollment, grievance redressal, and booth-level management for TVK members.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TVK Orathanadu',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: '#800000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="ta">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-black text-white">
        <SessionProviderWrapper session={session}>
          <PWARegistration />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
