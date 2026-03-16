import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

export default async function TenanciesPage() {
  const userId = await getUserId();

  let tenancies: Awaited<ReturnType<typeof prisma.tenancy.findMany>> = [];

  try {
    tenancies = await prisma.tenancy.findMany({
      where: { property: { userId } },
      orderBy: { startDate: 'desc' },
      include: { property: true, tenant: true },
    });
  } catch {
    // DB might not be available
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    ended: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Tenancies</h1>
          <p className="text-slate-500 dark:text-slate-400">{tenancies.length} tenanc{tenancies.length === 1 ? 'y' : 'ies'}</p>
        </div>
        <Link href="/dashboard/tenancies/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + New Tenancy
        </Link>
      </div>

      {tenancies.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">📋</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No tenancies yet</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Create a tenancy to link a property and tenant.</p>
          <Link href="/dashboard/tenancies/new" className="mt-6 inline-flex items-center px-6 py-3 rounded-lg bg-amber text-navy-dark font-semibold hover:bg-amber-light transition-colors">
            Create First Tenancy
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Property</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Tenant</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">Rent</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Start</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {tenancies.map((tenancy) => (
                <tr key={tenancy.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/tenancies/${tenancy.id}`} className="font-medium text-navy dark:text-white hover:text-amber">
                      {(tenancy as unknown as { property: { address: string } }).property.address}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{(tenancy as unknown as { tenant: { name: string } }).tenant.name}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 hidden sm:table-cell">£{tenancy.rentAmount}/{tenancy.rentFrequency === 'weekly' ? 'wk' : 'mo'}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 hidden md:table-cell">{tenancy.startDate.toLocaleDateString('en-GB')}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[tenancy.status] || statusColors.active}`}>
                      {tenancy.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
