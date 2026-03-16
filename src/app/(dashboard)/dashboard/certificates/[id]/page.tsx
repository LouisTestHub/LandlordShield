import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const certTypeLabels: Record<string, string> = {
  gas_safety: 'Gas Safety Certificate', eicr: 'EICR', epc: 'Energy Performance Certificate',
  legionella: 'Legionella Risk Assessment', fire_risk: 'Fire Risk Assessment',
  smoke_co: 'Smoke & CO Alarm Check', pat: 'PAT Testing', asbestos: 'Asbestos Survey',
};

export default async function CertificateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  const { id } = await params;

  const certificate = await prisma.certificate.findFirst({
    where: { id, property: { userId } },
    include: { property: true, complianceTasks: { orderBy: { dueDate: 'asc' } } },
  });

  if (!certificate) notFound();

  const now = new Date();
  const isExpired = certificate.expiryDate < now;
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const isExpiring = !isExpired && certificate.expiryDate <= thirtyDays;
  const daysUntilExpiry = Math.ceil((certificate.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/certificates" className="text-sm text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-amber">← All Certificates</Link>
        <div className="flex items-center gap-4 mt-2">
          <h1 className="text-2xl font-bold text-navy dark:text-white">{certTypeLabels[certificate.type] || certificate.type}</h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isExpired ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            isExpiring ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            {isExpired ? 'Expired' : isExpiring ? 'Expiring Soon' : 'Valid'}
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          <Link href={`/dashboard/properties/${certificate.property.id}`} className="hover:text-amber">{certificate.property.address}</Link>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className={`rounded-xl border-2 p-6 ${isExpired ? 'bg-red-50 dark:bg-red-900/20 border-red-200' : isExpiring ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200' : 'bg-green-50 dark:bg-green-900/20 border-green-200'}`}>
          <h3 className="text-sm text-slate-500 dark:text-slate-400">Days Until Expiry</h3>
          <p className={`mt-1 text-4xl font-bold ${isExpired ? 'text-red-600' : isExpiring ? 'text-amber-600' : 'text-green-600'}`}>
            {isExpired ? `${Math.abs(daysUntilExpiry)} overdue` : `${daysUntilExpiry} days`}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm text-slate-500 dark:text-slate-400">Issue Date</h3>
          <p className="mt-1 text-2xl font-bold text-navy dark:text-white">{certificate.issueDate.toLocaleDateString('en-GB')}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm text-slate-500 dark:text-slate-400">Expiry Date</h3>
          <p className="mt-1 text-2xl font-bold text-navy dark:text-white">{certificate.expiryDate.toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Certificate Details</h2>
          <dl className="space-y-3">
            <div className="flex justify-between"><dt className="text-sm text-slate-500 dark:text-slate-400">Certificate Number</dt><dd className="text-sm font-medium text-navy dark:text-white">{certificate.certificateNumber || '-'}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-slate-500 dark:text-slate-400">Engineer</dt><dd className="text-sm font-medium text-navy dark:text-white">{certificate.engineer || '-'}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-slate-500 dark:text-slate-400">Gas Safe Reg No.</dt><dd className="text-sm font-medium text-navy dark:text-white">{certificate.engineerGasRegNo || '-'}</dd></div>
          </dl>
          {certificate.notes && (
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">{certificate.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Compliance Tasks</h2>
          {certificate.complianceTasks.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No tasks linked to this certificate.</p>
          ) : (
            <div className="space-y-3">
              {certificate.complianceTasks.map((task) => (
                <div key={task.id} className={`p-3 rounded-lg border-l-4 ${
                  task.status === 'completed' ? 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10' :
                  task.status === 'overdue' ? 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10' :
                  'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10'
                }`}>
                  <p className="text-sm font-medium text-navy dark:text-white">{task.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Due: {task.dueDate.toLocaleDateString('en-GB')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
