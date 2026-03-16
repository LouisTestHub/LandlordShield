import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import { notFound } from 'next/navigation';
import Link from 'next/link';

function CertStatusBadge({ status, expiryDate }: { status: string; expiryDate: Date }) {
  const now = new Date();
  const isExpired = expiryDate < now;
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const isExpiring = expiryDate >= now && expiryDate <= thirtyDays;

  const color = isExpired ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    : isExpiring ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';

  const label = isExpired ? 'Expired' : isExpiring ? 'Expiring Soon' : 'Valid';

  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>;
}

const certTypeLabels: Record<string, string> = {
  gas_safety: 'Gas Safety', eicr: 'EICR', epc: 'EPC', legionella: 'Legionella',
  fire_risk: 'Fire Risk', smoke_co: 'Smoke & CO', pat: 'PAT Testing', asbestos: 'Asbestos',
};

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  const { id } = await params;

  const property = await prisma.property.findFirst({
    where: { id, userId },
    include: {
      tenancies: { include: { tenant: true }, orderBy: { startDate: 'desc' } },
      certificates: { orderBy: { expiryDate: 'asc' } },
      maintenance: { orderBy: { reportedDate: 'desc' }, take: 5 },
      insurance: true,
      documents: { orderBy: { uploadedAt: 'desc' }, take: 10 },
    },
  });

  if (!property) notFound();

  const now = new Date();
  const totalCerts = property.certificates.length;
  const validCerts = property.certificates.filter((c) => c.expiryDate > now).length;
  const complianceScore = totalCerts > 0 ? Math.round((validCerts / totalCerts) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/properties" className="text-sm text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-amber">← All Properties</Link>
          <h1 className="text-2xl font-bold text-navy dark:text-white mt-1">{property.address}</h1>
          <p className="text-slate-500 dark:text-slate-400">{property.postcode} · {property.type} · {property.bedrooms} bed · {property.bathrooms} bath</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/certificates/new?propertyId=${property.id}`} className="px-4 py-2 rounded-lg bg-amber text-navy-dark text-sm font-semibold hover:bg-amber-light transition-colors">
            + Add Certificate
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Compliance Score</h3>
          <div className="mt-2 flex items-end gap-2">
            <span className={`text-4xl font-bold ${complianceScore >= 80 ? 'text-green-600' : complianceScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
              {complianceScore}%
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">{validCerts}/{totalCerts} certificates valid</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Tenancies</h3>
          <p className="mt-2 text-4xl font-bold text-navy dark:text-white">{property.tenancies.filter((t) => t.status === 'active').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Rent</h3>
          <p className="mt-2 text-4xl font-bold text-navy dark:text-white">
            £{property.tenancies.filter((t) => t.status === 'active').reduce((sum, t) => sum + t.rentAmount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Certificates */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy dark:text-white">Certificates</h2>
          <Link href={`/dashboard/certificates/new?propertyId=${property.id}`} className="text-sm text-amber hover:text-amber-dark font-medium">+ Add</Link>
        </div>
        {property.certificates.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No certificates yet. Add your first certificate to start tracking compliance.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-slate-500 dark:text-slate-400">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500 dark:text-slate-400">Issue Date</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500 dark:text-slate-400">Expiry Date</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500 dark:text-slate-400">Engineer</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {property.certificates.map((cert) => (
                  <tr key={cert.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-2">
                      <Link href={`/dashboard/certificates/${cert.id}`} className="font-medium text-navy dark:text-white hover:text-amber">
                        {certTypeLabels[cert.type] || cert.type}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{cert.issueDate.toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{cert.expiryDate.toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{cert.engineer || '-'}</td>
                    <td className="py-3 px-2"><CertStatusBadge status={cert.status} expiryDate={cert.expiryDate} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tenancies */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy dark:text-white">Tenancies</h2>
          <Link href={`/dashboard/tenancies/new?propertyId=${property.id}`} className="text-sm text-amber hover:text-amber-dark font-medium">+ New Tenancy</Link>
        </div>
        {property.tenancies.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No tenancies yet.</p>
        ) : (
          <div className="space-y-3">
            {property.tenancies.map((tenancy) => (
              <Link key={tenancy.id} href={`/dashboard/tenancies/${tenancy.id}`} className="block p-4 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy dark:text-white">{tenancy.tenant.name}</p>
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

      {/* Maintenance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Recent Maintenance</h2>
        {property.maintenance.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No maintenance requests.</p>
        ) : (
          <div className="space-y-3">
            {property.maintenance.map((req) => (
              <div key={req.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy dark:text-white">{req.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{req.reportedDate.toLocaleDateString('en-GB')}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    req.priority === 'emergency' ? 'bg-red-100 text-red-700' :
                    req.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{req.priority}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
