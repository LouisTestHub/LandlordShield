import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

export default async function TenantsPage() {
  await getUserId(); // auth check

  let tenants: Awaited<ReturnType<typeof prisma.tenant.findMany>> = [];

  try {
    tenants = await prisma.tenant.findMany({
      orderBy: { name: 'asc' },
      include: { tenancies: { where: { status: 'active' }, include: { property: true } } },
    });
  } catch {
    // DB might not be available
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Tenant Directory</h1>
          <p className="text-slate-500 dark:text-slate-400">{tenants.length} tenant{tenants.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/tenants/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Add Tenant
        </Link>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">👥</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No tenants yet</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Add your first tenant to get started.</p>
          <Link href="/dashboard/tenants/new" className="mt-6 inline-flex items-center px-6 py-3 rounded-lg bg-amber text-navy-dark font-semibold hover:bg-amber-light transition-colors">
            Add Your First Tenant
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Right to Rent</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 hidden lg:table-cell">Active Tenancy</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => {
                const activeTenancy = (tenant as unknown as { tenancies: Array<{ property: { address: string } }> }).tenancies[0];
                return (
                  <tr key={tenant.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4">
                      <Link href={`/dashboard/tenants/${tenant.id}`} className="font-medium text-navy dark:text-white hover:text-amber">{tenant.name}</Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 hidden sm:table-cell">{tenant.email || '-'}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 hidden md:table-cell">{tenant.phone || '-'}</td>
                    <td className="py-3 px-4">
                      {tenant.rightToRentChecked ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">✓ Checked</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Not checked</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 hidden lg:table-cell">{activeTenancy ? activeTenancy.property.address : 'None'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
