import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

const certTypeLabels: Record<string, string> = {
  gas_safety: 'Gas Safety', eicr: 'EICR', epc: 'EPC', legionella: 'Legionella',
  fire_risk: 'Fire Risk', smoke_co: 'Smoke & CO', pat: 'PAT Testing', asbestos: 'Asbestos',
};

export default async function CertificatesPage() {
  const userId = await getUserId();

  let certificates: Array<{
    id: string; type: string; issueDate: Date; expiryDate: Date; status: string;
    engineer: string | null; certificateNumber: string | null;
    property: { id: string; address: string; postcode: string };
  }> = [];

  try {
    certificates = await prisma.certificate.findMany({
      where: { property: { userId } },
      orderBy: { expiryDate: 'asc' },
      include: { property: { select: { id: true, address: true, postcode: true } } },
    });
  } catch {
    // DB might not be available
  }

  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">All Certificates</h1>
          <p className="text-slate-500 dark:text-slate-400">{certificates.length} certificate{certificates.length !== 1 ? 's' : ''} across all properties</p>
        </div>
        <Link href="/dashboard/certificates/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Add Certificate
        </Link>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">📜</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No certificates yet</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Add your first certificate to start tracking expiry dates.</p>
          <Link href="/dashboard/certificates/new" className="mt-6 inline-flex items-center px-6 py-3 rounded-lg bg-amber text-navy-dark font-semibold hover:bg-amber-light transition-colors">
            Add First Certificate
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Property</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">Issue Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Expiry Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Engineer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => {
                const isExpired = cert.expiryDate < now;
                const isExpiring = !isExpired && cert.expiryDate <= thirtyDays;
                return (
                  <tr key={cert.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4">
                      <Link href={`/dashboard/certificates/${cert.id}`} className="font-medium text-navy dark:text-white hover:text-amber">
                        {certTypeLabels[cert.type] || cert.type}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <Link href={`/dashboard/properties/${cert.property.id}`} className="hover:text-amber">{cert.property.address}</Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 hidden sm:table-cell">{cert.issueDate.toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{cert.expiryDate.toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 hidden md:table-cell">{cert.engineer || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isExpired ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        isExpiring ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {isExpired ? 'Expired' : isExpiring ? 'Expiring' : 'Valid'}
                      </span>
                    </td>
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
