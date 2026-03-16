import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

export default async function DashboardPage() {
  let stats = { properties: 0, tenants: 0, activeTenancies: 0, expiredCerts: 0, expiringCerts: 0, overduePayments: 0, totalRentDue: 0 };

  try {
    const userId = await getUserId();
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const properties = await prisma.property.findMany({ where: { userId }, select: { id: true } });
    const propertyIds = properties.map((p) => p.id);

    stats.properties = properties.length;
    stats.tenants = await prisma.tenant.count();
    stats.activeTenancies = await prisma.tenancy.count({ where: { propertyId: { in: propertyIds }, status: 'active' } });
    stats.expiredCerts = await prisma.certificate.count({ where: { propertyId: { in: propertyIds }, expiryDate: { lt: now } } });
    stats.expiringCerts = await prisma.certificate.count({ where: { propertyId: { in: propertyIds }, expiryDate: { gte: now, lte: thirtyDays } } });
    stats.overduePayments = await prisma.rentPayment.count({
      where: { tenancy: { propertyId: { in: propertyIds } }, status: { in: ['missed', 'late'] } },
    });
  } catch {
    // DB might not be available — show empty state
  }

  const statCards = [
    { label: 'Properties', value: stats.properties, href: '/dashboard/properties', icon: '🏠', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    { label: 'Active Tenancies', value: stats.activeTenancies, href: '/dashboard/tenancies', icon: '📋', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
    { label: 'Expired Certificates', value: stats.expiredCerts, href: '/dashboard/certificates', icon: '🔴', color: stats.expiredCerts > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
    { label: 'Expiring (30 days)', value: stats.expiringCerts, href: '/dashboard/compliance', icon: '🟡', color: stats.expiringCerts > 0 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
    { label: 'Overdue Payments', value: stats.overduePayments, href: '/dashboard/rent/payments', icon: '💷', color: stats.overduePayments > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
    { label: 'Tenants', value: stats.tenants, href: '/dashboard/tenants', icon: '👥', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Your portfolio at a glance</p>
        </div>
        <Link href="/dashboard/properties/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark dark:hover:bg-amber-light">
          + Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className={`block p-6 rounded-xl border-2 ${card.color} hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-navy dark:text-white">{card.value}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/properties/new" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <span className="text-xl">🏠</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add Property</span>
            </Link>
            <Link href="/dashboard/tenants/new" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <span className="text-xl">👤</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add Tenant</span>
            </Link>
            <Link href="/dashboard/certificates/new" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <span className="text-xl">📜</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add Certificate</span>
            </Link>
            <Link href="/dashboard/notices" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <span className="text-xl">📝</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Create Notice</span>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Regulatory Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Renters&apos; Rights Act Phase 1</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">1 May 2026 — Section 21 abolished, periodic tenancies</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-amber shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Property Portal Registration</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Late 2026 — Mandatory registration with compliance docs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">MTD for ITSA (£50K+)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">April 2026 — Digital records, quarterly submissions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-blue-300 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">MTD Threshold Drop (£30K+)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">April 2027</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
