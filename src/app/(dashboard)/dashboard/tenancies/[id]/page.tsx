import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function TenancyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  const { id } = await params;

  const tenancy = await prisma.tenancy.findFirst({
    where: { id, property: { userId } },
    include: {
      property: true,
      tenant: true,
      rentPayments: { orderBy: { dueDate: 'desc' }, take: 12 },
      rentIncreases: { orderBy: { createdAt: 'desc' } },
      notices: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!tenancy) notFound();

  const now = new Date();
  const depositDeadline = tenancy.startDate ? new Date(tenancy.startDate.getTime() + 30 * 24 * 60 * 60 * 1000) : null;
  const depositOverdue = tenancy.depositAmount && !tenancy.depositProtectedDate && depositDeadline && depositDeadline < now;

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    ended: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  };

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
          <Link href="/dashboard/tenancies" className="text-sm text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-amber">← All Tenancies</Link>
          <h1 className="text-2xl font-bold text-navy dark:text-white mt-1">{tenancy.property.address}</h1>
          <p className="text-slate-500 dark:text-slate-400">Tenant: {tenancy.tenant.name} · £{tenancy.rentAmount}/{tenancy.rentFrequency === 'weekly' ? 'wk' : 'mo'}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[tenancy.status]}`}>
          {tenancy.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm text-slate-500 dark:text-slate-400">Rent</h3>
          <p className="mt-1 text-3xl font-bold text-navy dark:text-white">£{tenancy.rentAmount}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">per {tenancy.rentFrequency === 'weekly' ? 'week' : 'month'}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm text-slate-500 dark:text-slate-400">Start Date</h3>
          <p className="mt-1 text-3xl font-bold text-navy dark:text-white">{tenancy.startDate.toLocaleDateString('en-GB')}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{tenancy.endDate ? `Ends: ${tenancy.endDate.toLocaleDateString('en-GB')}` : 'Periodic tenancy'}</p>
        </div>
        <div className={`rounded-xl border-2 p-6 ${depositOverdue ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
          <h3 className="text-sm text-slate-500 dark:text-slate-400">Deposit</h3>
          {tenancy.depositAmount ? (
            <>
              <p className="mt-1 text-3xl font-bold text-navy dark:text-white">£{tenancy.depositAmount}</p>
              {tenancy.depositProtectedDate ? (
                <p className="text-sm text-green-600 dark:text-green-400">Protected with {tenancy.depositScheme} on {tenancy.depositProtectedDate.toLocaleDateString('en-GB')}</p>
              ) : depositOverdue ? (
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">⚠️ Not yet protected — deadline passed!</p>
              ) : (
                <p className="text-sm text-amber-600 dark:text-amber-400">Not yet protected — deadline: {depositDeadline?.toLocaleDateString('en-GB')}</p>
              )}
            </>
          ) : (
            <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">No deposit</p>
          )}
        </div>
      </div>

      {/* Rent Payments */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy dark:text-white">Rent Payments</h2>
          <Link href="/dashboard/rent/payments" className="text-sm text-amber hover:text-amber-dark font-medium">Manage Payments →</Link>
        </div>
        {tenancy.rentPayments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No payment records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">Due Date</th>
                  <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">Amount</th>
                  <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">Paid Date</th>
                  <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {tenancy.rentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2 px-2">{payment.dueDate.toLocaleDateString('en-GB')}</td>
                    <td className="py-2 px-2">£{payment.amount}</td>
                    <td className="py-2 px-2">{payment.paidDate ? payment.paidDate.toLocaleDateString('en-GB') : '-'}</td>
                    <td className="py-2 px-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[payment.status]}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notices */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy dark:text-white">Notices</h2>
          <Link href={`/dashboard/notices?tenancyId=${tenancy.id}`} className="text-sm text-amber hover:text-amber-dark font-medium">+ Create Notice</Link>
        </div>
        {tenancy.notices.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No notices served.</p>
        ) : (
          <div className="space-y-3">
            {tenancy.notices.map((notice) => (
              <div key={notice.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy dark:text-white">{notice.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {notice.servedDate ? `Served: ${notice.servedDate.toLocaleDateString('en-GB')}` : 'Draft'}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    notice.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                    notice.status === 'served' ? 'bg-blue-100 text-blue-700' :
                    notice.status === 'court' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{notice.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
