import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from '../components/Providers';

export const viewport: Viewport = {
  themeColor: '#800020',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Mangal — AI-Powered Matrimony & Wedding Ecosystem',
  description:
    'India’s premier AI-powered matrimonial and wedding platform. Verified profiles, 36 Gun Milan Vedic astrology, authentic Pandits, and curated wedding organizers.',
  keywords: [
    'Matrimony',
    'Shaadi',
    'Indian Matrimonial',
    'Kundli Milan',
    'Gun Milan',
    'Pandit Booking',
    'Wedding Planners',
    'Verified Profiles',
  ],
  openGraph: {
    title: 'Mangal — Auspicious Matrimony & Wedding Ecosystem',
    description: 'Find your sacred life partner with verified trust and AI compatibility matching.',
    url: 'https://mangal.com',
    siteName: 'Mangal',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪔</text></svg>" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
