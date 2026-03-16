import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

export default async function IncomePage() {
  let payments: { id: string; amount: number; dueDate: Date; paidDate: Date | null; status: string; method: string | null; tenancy: { property: { address: string }; tenant: { name: string } } }[] = [];

  try {
    const userId = await getUserId();
    const properties = await prisma.property.findMany({ where: { userId }, select: { id: true } });
    const propertyIds = properties.map(p => p.id);

    payments = await prisma.rentPayment.findMany({
      where: { tenancy: { propertyId: { in: propertyIds } } },
      orderBy: { dueDate: 'desc' },
      include: { tenancy: { include: { property: { select: { address: true } }, tenant: { select: { name: true } } } } },
      take: 100,
    }) as typeof payments;
  } catch {
    // DB may not be available
  }

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalMissed = payments.filter(p => p.status === 'missed').reduce((s, p) => s + p.amount, 0);

  const statusColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    partial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    missed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    void: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/finance" className="hover:text-navy dark:hover:text-white">Finance</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">Income</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Rental Income</h1>
          <p className="text-slate-500 dark:text-slate-400">{payments.length} payment records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Collected</p>
          <p className="text-3xl font-bold text-green-600">£{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Missed</p>
          <p className="text-3xl font-bold text-red-600">£{totalMissed.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Collection Rate</p>
          <p className="text-3xl font-bold text-navy dark:text-white">
            {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'paid').length / payments.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">💰</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No income recorded</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Income is auto-populated from rent payments.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tenant</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase hidden md:table-cell">Property</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Due Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm font-medium text-navy dark:text-white">{p.tenancy.tenant.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">{p.tenancy.property.address}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(p.dueDate).toLocaleDateString('en-GB')}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-navy dark:text-white">£{p.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || statusColors.void}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
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
