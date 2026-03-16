'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export function DashboardHeader() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 lg:pl-64">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
            aria-label="Toggle sidebar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-navy dark:text-white lg:hidden">
            <span>Landlord</span><span className="text-amber">Shield</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{session?.user?.name || 'User'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{session?.user?.email}</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-navy dark:bg-slate-950">
            <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
              <span className="text-xl font-bold text-white">Landlord<span className="text-amber">Shield</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white p-1">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              {[
                { group: 'Overview', items: [{ name: 'Dashboard', href: '/dashboard' }] },
                { group: 'Properties', items: [{ name: 'All Properties', href: '/dashboard/properties' }, { name: 'Add Property', href: '/dashboard/properties/new' }] },
                { group: 'Tenants', items: [{ name: 'Directory', href: '/dashboard/tenants' }, { name: 'Add Tenant', href: '/dashboard/tenants/new' }] },
                { group: 'Tenancies', items: [{ name: 'All Tenancies', href: '/dashboard/tenancies' }, { name: 'New Tenancy', href: '/dashboard/tenancies/new' }] },
                { group: 'Compliance', items: [{ name: 'Calendar', href: '/dashboard/compliance' }, { name: 'Certificates', href: '/dashboard/certificates' }] },
                { group: 'Rent', items: [{ name: 'Dashboard', href: '/dashboard/rent' }, { name: 'Payments', href: '/dashboard/rent/payments' }, { name: 'Increases', href: '/dashboard/rent/increases' }, { name: 'Deposits', href: '/dashboard/rent/deposits' }] },
                { group: 'Notices', items: [{ name: 'Generator', href: '/dashboard/notices' }] },
              ].map((group) => (
                <div key={group.group} className="mb-4">
                  <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{group.group}</h3>
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white">
                      {item.name}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
