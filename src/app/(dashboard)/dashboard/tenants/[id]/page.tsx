import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await getUserId();
  const { id } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: { tenancies: { include: { property: true }, orderBy: { startDate: 'desc' } } },
  });

  if (!tenant) notFound();

  const now = new Date();
  const rightToRentExpired = tenant.rightToRentExpiry && tenant.rightToRentExpiry < now;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/tenants" className="text-sm text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-amber">← All Tenants</Link>
          <h1 className="text-2xl font-bold text-navy dark:text-white mt-1">{tenant.name}</h1>
          <p className="text-slate-500 dark:text-slate-400">{tenant.email || 'No email'} · {tenant.phone || 'No phone'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {/* Personal Info */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Personal Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className="text-sm text-slate-500 dark:text-slate-400">Email</dt><dd className="font-medium text-navy dark:text-white">{tenant.email || '-'}</dd></div>
              <div><dt className="text-sm text-slate-500 dark:text-slate-400">Phone</dt><dd className="font-medium text-navy dark:text-white">{tenant.phone || '-'}</dd></div>
              <div><dt className="text-sm text-slate-500 dark:text-slate-400">Date of Birth</dt><dd className="font-medium text-navy dark:text-white">{tenant.dateOfBirth ? tenant.dateOfBirth.toLocaleDateString('en-GB') : '-'}</dd></div>
              <div><dt className="text-sm text-slate-500 dark:text-slate-400">Nationality</dt><dd className="font-medium text-navy dark:text-white">{tenant.nationality || '-'}</dd></div>
              <div><dt className="text-sm text-slate-500 dark:text-slate-400">Emergency Contact</dt><dd className="font-medium text-navy dark:text-white">{tenant.emergencyContact || '-'}</dd></div>
              <div><dt className="text-sm text-slate-500 dark:text-slate-400">Emergency Phone</dt><dd className="font-medium text-navy dark:text-white">{tenant.emergencyPhone || '-'}</dd></div>
            </dl>
            {tenant.notes && <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">{tenant.notes}</p>}
          </div>

          {/* Tenancy History */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Tenancy History</h2>
            {tenant.tenancies.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No tenancies.</p>
            ) : (
              <div className="space-y-3">
                {tenant.tenancies.map((tenancy) => (
                  <Link key={tenancy.id} href={`/dashboard/tenancies/${tenancy.id}`} className="block p-4 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-navy dark:text-white">{tenancy.property.address}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {tenancy.startDate.toLocaleDateString('en-GB')} — {tenancy.endDate ? tenancy.endDate.toLocaleDateString('en-GB') : 'Periodic'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-navy dark:text-white">£{tenancy.rentAmount}/mo</p>
                        <span className={`text-xs font-medium ${tenancy.status === 'active' ? 'text-green-600' : 'text-slate-500'}`}>{tenancy.status}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right to Rent sidebar */}
        <div>
          <div className={`rounded-xl border-2 p-6 ${
            !tenant.rightToRentChecked ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
            rightToRentExpired ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          }`}>
            <h3 className="font-semibold text-navy dark:text-white mb-3">Right to Rent Status</h3>
            {!tenant.rightToRentChecked ? (
              <>
                <div className="text-3xl mb-2">⚠️</div>
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">Check not completed</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">You must verify the tenant&apos;s right to rent before the tenancy starts.</p>
              </>
            ) : rightToRentExpired ? (
              <>
                <div className="text-3xl mb-2">❌</div>
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">Expired</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Follow-up check required. Expired {tenant.rightToRentExpiry?.toLocaleDateString('en-GB')}.</p>
              </>
            ) : (
              <>
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Verified</p>
                {tenant.rightToRentExpiry && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Expires: {tenant.rightToRentExpiry.toLocaleDateString('en-GB')}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
