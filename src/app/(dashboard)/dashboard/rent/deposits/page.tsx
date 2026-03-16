import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

export default async function DepositsPage() {
  const userId = await getUserId();

  let tenancies: Array<{
    id: string; depositAmount: number | null; depositScheme: string | null;
    depositReference: string | null; depositProtectedDate: Date | null;
    startDate: Date; status: string;
    property: { address: string }; tenant: { name: string };
  }> = [];

  try {
    tenancies = await prisma.tenancy.findMany({
      where: { property: { userId }, depositAmount: { not: null } },
      orderBy: { startDate: 'desc' },
      include: { property: { select: { address: true } }, tenant: { select: { name: true } } },
    }) as typeof tenancies;
  } catch {
    // DB not available
  }

  const now = new Date();

  const prescribedInfoChecklist = [
    'Tenant\'s name and contact details',
    'Landlord\'s name and contact details',
    'Amount of deposit and property address',
    'Name and contact details of deposit scheme',
    'Information on the scheme\'s dispute resolution procedure',
    'Circumstances under which deductions may be made',
    'What to do if unable to contact the landlord',
    'Information leaflet from the relevant scheme',
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Deposit Protection</h1>
          <p className="text-slate-500 dark:text-slate-400">Track deposit protection status and deadlines</p>
        </div>
        <Link href="/dashboard/rent" className="text-sm text-slate-500 hover:text-navy dark:text-slate-400 dark:hover:text-amber">← Rent Dashboard</Link>
      </div>

      {/* Warning banner */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">⚠️ Important</h3>
        <p className="text-sm text-red-700 dark:text-red-400">
          Deposits must be protected within 30 days of receipt. Failure to protect can result in penalties of 1-3x the deposit amount and inability to serve Section 21 notices (though Section 21 is abolished under the Renters&apos; Rights Act).
        </p>
      </div>

      {tenancies.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">🔒</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No deposits to track</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Deposits will appear here when you add them to tenancies.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {tenancies.map((tenancy) => {
            const deadline = new Date(tenancy.startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            const isProtected = !!tenancy.depositProtectedDate;
            const isOverdue = !isProtected && deadline < now;
            const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div key={tenancy.id} className={`bg-white dark:bg-slate-800 rounded-xl border-2 p-6 ${
                isProtected ? 'border-green-200 dark:border-green-800' :
                isOverdue ? 'border-red-200 dark:border-red-800' :
                'border-amber-200 dark:border-amber-800'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Link href={`/dashboard/tenancies/${tenancy.id}`} className="font-semibold text-navy dark:text-white hover:text-amber">
                      {tenancy.property.address}
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tenancy.tenant.name} · Deposit: £{tenancy.depositAmount}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {isProtected ? (
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          ✓ Protected
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {tenancy.depositScheme} · Ref: {tenancy.depositReference || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Protected: {tenancy.depositProtectedDate?.toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    ) : isOverdue ? (
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          ⚠️ OVERDUE
                        </span>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">Deadline was {deadline.toLocaleDateString('en-GB')}</p>
                        <p className="text-xs text-red-600 dark:text-red-400">{Math.abs(daysLeft)} days overdue</p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          ⏳ Pending
                        </span>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Deadline: {deadline.toLocaleDateString('en-GB')}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">{daysLeft} days remaining</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prescribed Information Checklist */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-3">📋 Prescribed Information Checklist</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">You must provide this information to the tenant within 30 days of receiving the deposit:</p>
        <div className="space-y-2">
          {prescribedInfoChecklist.map((item) => (
            <label key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-amber focus:ring-amber" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
