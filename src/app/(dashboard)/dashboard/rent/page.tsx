import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

export default async function RentDashboardPage() {
  const userId = await getUserId();

  let stats = { totalMonthlyIncome: 0, totalArrears: 0, activeTenancies: 0, upcomingPayments: 0 };
  let recentPayments: Array<{
    id: string; amount: number; dueDate: Date; paidDate: Date | null; status: string;
    tenancy: { property: { address: string }; tenant: { name: string } };
  }> = [];

  try {
    const tenancies = await prisma.tenancy.findMany({
      where: { property: { userId }, status: 'active' },
      include: { property: true, tenant: true },
    });

    stats.activeTenancies = tenancies.length;
    stats.totalMonthlyIncome = tenancies.reduce((sum, t) => sum + (t.rentFrequency === 'monthly' ? t.rentAmount : t.rentAmount * 4.33), 0);

    const now = new Date();
    const missedPayments = await prisma.rentPayment.findMany({
      where: { tenancy: { property: { userId } }, status: { in: ['missed', 'late', 'partial'] } },
    });
    stats.totalArrears = missedPayments.reduce((sum, p) => sum + p.amount, 0);

    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    stats.upcomingPayments = await prisma.rentPayment.count({
      where: { tenancy: { property: { userId } }, dueDate: { gte: now, lte: nextMonth }, status: { not: 'paid' } },
    });

    recentPayments = await prisma.rentPayment.findMany({
      where: { tenancy: { property: { userId } } },
      orderBy: { dueDate: 'desc' },
      take: 10,
      include: { tenancy: { include: { property: { select: { address: true } }, tenant: { select: { name: true } } } } },
    }) as typeof recentPayments;
  } catch {
    // DB not available
  }

  const paymentStatusColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    partial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    missed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    void: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Rent Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Track income, arrears, and payments</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Income</p>
          <p className="mt-1 text-3xl font-bold text-navy dark:text-white">£{stats.totalMonthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        </div>
        <div className={`rounded-xl border-2 p-6 ${stats.totalArrears > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Arrears</p>
          <p className={`mt-1 text-3xl font-bold ${stats.totalArrears > 0 ? 'text-red-600' : 'text-navy dark:text-white'}`}>£{stats.totalArrears.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Active Tenancies</p>
          <p className="mt-1 text-3xl font-bold text-navy dark:text-white">{stats.activeTenancies}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming Due</p>
          <p className="mt-1 text-3xl font-bold text-navy dark:text-white">{stats.upcomingPayments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent payments */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-navy dark:text-white">Recent Payments</h2>
            <Link href="/dashboard/rent/payments" className="text-sm text-amber font-medium">View All →</Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No payment records yet. Record payments from the Payments page.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">Property</th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">Tenant</th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">Amount</th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">Due</th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-2 px-2 text-slate-700 dark:text-slate-300">{p.tenancy.property.address}</td>
                      <td className="py-2 px-2 text-slate-600 dark:text-slate-400">{p.tenancy.tenant.name}</td>
                      <td className="py-2 px-2 font-medium text-navy dark:text-white">£{p.amount}</td>
                      <td className="py-2 px-2 text-slate-600 dark:text-slate-400">{p.dueDate.toLocaleDateString('en-GB')}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[p.status]}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Rent Management</h2>
          <div className="space-y-3">
            <Link href="/dashboard/rent/payments" className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <p className="font-medium text-navy dark:text-white">💳 Payment Tracker</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Record and track rent payments</p>
            </Link>
            <Link href="/dashboard/rent/increases" className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <p className="font-medium text-navy dark:text-white">📈 Rent Increases</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Section 13 notices & calculator</p>
            </Link>
            <Link href="/dashboard/rent/deposits" className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <p className="font-medium text-navy dark:text-white">🔒 Deposits</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Protection status & deadlines</p>
            </Link>
            <Link href="/dashboard/notices" className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <p className="font-medium text-navy dark:text-white">📝 Notices</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generate & track legal notices</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
