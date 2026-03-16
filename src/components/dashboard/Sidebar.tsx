'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    group: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    ],
  },
  {
    group: 'Properties',
    items: [
      { name: 'All Properties', href: '/dashboard/properties', icon: '🏠' },
      { name: 'Add Property', href: '/dashboard/properties/new', icon: '➕' },
    ],
  },
  {
    group: 'Tenants',
    items: [
      { name: 'Directory', href: '/dashboard/tenants', icon: '👥' },
      { name: 'Add Tenant', href: '/dashboard/tenants/new', icon: '➕' },
    ],
  },
  {
    group: 'Tenancies',
    items: [
      { name: 'All Tenancies', href: '/dashboard/tenancies', icon: '📋' },
      { name: 'New Tenancy', href: '/dashboard/tenancies/new', icon: '➕' },
    ],
  },
  {
    group: 'Compliance',
    items: [
      { name: 'Calendar', href: '/dashboard/compliance', icon: '📅' },
      { name: 'Certificates', href: '/dashboard/certificates', icon: '📜' },
    ],
  },
  {
    group: 'Rent',
    items: [
      { name: 'Dashboard', href: '/dashboard/rent', icon: '💷' },
      { name: 'Payments', href: '/dashboard/rent/payments', icon: '💳' },
      { name: 'Increases', href: '/dashboard/rent/increases', icon: '📈' },
      { name: 'Deposits', href: '/dashboard/rent/deposits', icon: '🔒' },
    ],
  },
  {
    group: 'Notices',
    items: [
      { name: 'Generator', href: '/dashboard/notices', icon: '📝' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-navy dark:bg-slate-950 text-white overflow-y-auto">
      <div className="flex items-center h-16 px-6 border-b border-white/10">
        <Link href="/dashboard" className="text-xl font-bold">
          <span className="text-white">Landlord</span>
          <span className="text-amber">Shield</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-6">
        {navigation.map((group) => (
          <div key={group.group}>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{group.group}</h3>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/15 text-amber'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
          ← Back to Website
        </Link>
      </div>
    </aside>
  );
}
