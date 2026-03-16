import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

const certTypeLabels: Record<string, string> = {
  gas_safety: 'Gas Safety', eicr: 'EICR', epc: 'EPC', legionella: 'Legionella',
  fire_risk: 'Fire Risk', smoke_co: 'Smoke & CO', pat: 'PAT Testing', asbestos: 'Asbestos',
};

const certTypeValidityLabels: Record<string, string> = {
  gas_safety: '12 months', eicr: '5 years', epc: '10 years', legionella: '2 years',
  fire_risk: 'Annual review', smoke_co: 'Annual check', pat: 'Annual', asbestos: 'Annual review',
};

export default async function CompliancePage() {
  const userId = await getUserId();

  let certificates: Array<{
    id: string; type: string; issueDate: Date; expiryDate: Date; status: string;
    property: { id: string; address: string; postcode: string };
  }> = [];
  let properties: Array<{ id: string; address: string }> = [];

  try {
    certificates = await prisma.certificate.findMany({
      where: { property: { userId } },
      orderBy: { expiryDate: 'asc' },
      include: { property: { select: { id: true, address: true, postcode: true } } },
    });
    properties = await prisma.property.findMany({ where: { userId }, select: { id: true, address: true } });
  } catch {
    // DB might not be available
  }

  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const expired = certificates.filter((c) => c.expiryDate < now);
  const expiring30 = certificates.filter((c) => c.expiryDate >= now && c.expiryDate <= thirtyDays);
  const expiring60 = certificates.filter((c) => c.expiryDate > thirtyDays && c.expiryDate <= sixtyDays);
  const expiring90 = certificates.filter((c) => c.expiryDate > sixtyDays && c.expiryDate <= ninetyDays);
  const valid = certificates.filter((c) => c.expiryDate > ninetyDays);

  // Compliance score per property
  const propertyScores = properties.map((p) => {
    const propCerts = certificates.filter((c) => c.property.id === p.id);
    const validCount = propCerts.filter((c) => c.expiryDate > now).length;
    const score = propCerts.length > 0 ? Math.round((validCount / propCerts.length) * 100) : 0;
    return { ...p, certs: propCerts.length, valid: validCount, score };
  });

  // Property Portal readiness
  const requiredCertTypes = ['gas_safety', 'eicr', 'epc', 'smoke_co'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Compliance Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400">Track all certificate renewals and deadlines</p>
        </div>
        <Link href="/dashboard/certificates/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Add Certificate
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{expired.length}</p>
          <p className="text-sm text-red-600 dark:text-red-400">Expired</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{expiring30.length}</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">Within 30 days</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{expiring60.length}</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">31-60 days</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{expiring90.length}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">61-90 days</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{valid.length}</p>
          <p className="text-sm text-green-600 dark:text-green-400">Valid (90+ days)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Expired & Expiring list */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Urgent: Expired & Expiring Certificates</h2>
          {[...expired, ...expiring30].length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl">✅</span>
              <p className="mt-2 text-slate-500 dark:text-slate-400">All certificates are in date. Nice one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...expired, ...expiring30].map((cert) => {
                const isExpired = cert.expiryDate < now;
                return (
                  <Link key={cert.id} href={`/dashboard/certificates/${cert.id}`} className={`block p-4 rounded-lg border-l-4 ${isExpired ? 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10'} hover:shadow-md transition-all`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-navy dark:text-white">{certTypeLabels[cert.type] || cert.type}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{cert.property.address}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {isExpired ? 'EXPIRED' : 'EXPIRING'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{cert.expiryDate.toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Property compliance scores */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Property Scores</h2>
          {propertyScores.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No properties yet.</p>
          ) : (
            <div className="space-y-4">
              {propertyScores.map((p) => (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1">
                    <Link href={`/dashboard/properties/${p.id}`} className="text-sm font-medium text-navy dark:text-white hover:text-amber truncate mr-2">{p.address}</Link>
                    <span className={`text-sm font-bold ${p.score >= 80 ? 'text-green-600' : p.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{p.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${p.score >= 80 ? 'bg-green-500' : p.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${p.score}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.valid}/{p.certs} certificates valid</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Portal Readiness */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">🏛️ Property Portal Readiness</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Required documents for Property Portal registration: Gas Safety, EICR, EPC, Smoke & CO Alarms</p>
        {properties.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Add properties to check readiness.</p>
        ) : (
          <div className="space-y-4">
            {properties.map((p) => {
              const propCerts = certificates.filter((c) => c.property.id === p.id);
              const presentTypes = new Set(propCerts.filter((c) => c.expiryDate > now).map((c) => c.type));
              return (
                <div key={p.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <p className="font-medium text-navy dark:text-white mb-2">{p.address}</p>
                  <div className="flex flex-wrap gap-2">
                    {requiredCertTypes.map((type) => (
                      <span key={type} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        presentTypes.has(type) ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {presentTypes.has(type) ? '✓' : '✗'} {certTypeLabels[type]}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate validity guide */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Certificate Validity Guide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(certTypeLabels).map(([key, label]) => (
            <div key={key} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
              <p className="text-sm font-medium text-navy dark:text-white">{label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{certTypeValidityLabels[key]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
