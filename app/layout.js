import './globals.css';
import { auth } from '@/auth';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

export const metadata = {
  title: 'TVK Orathanadu – தமிழக வெற்றி கழகம் | ஓரத்தநாடு தொகுதி 175',
  description:
    'Thamizhaga Vetri Kazhagam – Orathanadu Assembly Constituency 175. Digital voter enrollment, grievance redressal, and booth-level management for TVK members.',
  keywords: 'TVK, Thamizhaga Vetri Kazhagam, Orathanadu, Tamil Nadu, voter enrollment, grievance',
  manifest: '/manifest.json',
  openGraph: {
    title: 'TVK Orathanadu – People\'s Portal',
    description: 'பிறப்பொக்கும் எல்லா உயிர்க்கும் – Orathanadu Constituency 175',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TVK 175',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" type="image/png" />
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
