import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://landlordshield.co.uk'),
  title: {
    default: 'LandlordShield — Landlord Compliance Platform | Renters\' Rights Act Ready',
    template: '%s | LandlordShield',
  },
  description:
    'All-in-one compliance platform for UK landlords. Renters\' Rights Act 2025, Property Portal registration, Making Tax Digital — every requirement, one platform, zero fines.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://landlordshield.co.uk',
    siteName: 'LandlordShield',
    title: 'LandlordShield — Every Compliance Requirement. One Platform. Zero Fines.',
    description: 'All-in-one compliance platform for UK private landlords.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className="font-[var(--font-inter)] bg-cream text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
