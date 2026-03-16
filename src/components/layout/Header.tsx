'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LandlordShieldLogo } from '@/components/icons/LandlordShieldLogo';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/90 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <LandlordShieldLogo className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm font-medium text-slate-600 hover:text-navy transition-colors dark:text-slate-300">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-navy transition-colors dark:text-slate-300">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-navy transition-colors dark:text-slate-300">About</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-navy hover:text-navy-light transition-colors dark:text-amber">
              Sign In
            </Link>
            <Link href="/register" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors">
              Start Free Trial
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 dark:border-slate-700">
            <nav className="flex flex-col gap-2 pt-4">
              <Link href="/features" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800">Features</Link>
              <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800">Pricing</Link>
              <Link href="/about" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800">About</Link>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-navy dark:text-amber">Sign In</Link>
              <Link href="/register" className="mx-4 py-2 text-center rounded-lg bg-navy text-white text-sm font-semibold">Start Free Trial</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
