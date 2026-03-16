import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    vacant: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    sold: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

async function getComplianceStatus(propertyId: string) {
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const certs = await prisma.certificate.findMany({ where: { propertyId } });
  const expired = certs.filter((c) => c.expiryDate < now).length;
  const expiring = certs.filter((c) => c.expiryDate >= now && c.expiryDate <= thirtyDays).length;
  if (expired > 0) return 'red';
  if (expiring > 0) return 'amber';
  if (certs.length === 0) return 'grey';
  return 'green';
}

export default async function PropertiesPage() {
  let properties: Awaited<ReturnType<typeof prisma.property.findMany>> = [];
  let complianceMap: Record<string, string> = {};

  try {
    const userId = await getUserId();
    properties = await prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { tenancies: { where: { status: 'active' }, include: { tenant: true } }, _count: { select: { certificates: true } } },
    });

    for (const p of properties) {
      complianceMap[p.id] = await getComplianceStatus(p.id);
    }
  } catch {
    // DB might not be available
  }

  const ragColors: Record<string, string> = {
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
    grey: 'bg-slate-300 dark:bg-slate-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Properties</h1>
          <p className="text-slate-500 dark:text-slate-400">{properties.length} propert{properties.length === 1 ? 'y' : 'ies'} in your portfolio</p>
        </div>
        <Link href="/dashboard/properties/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">🏠</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No properties yet</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Add your first property to get started with compliance tracking.</p>
          <Link href="/dashboard/properties/new" className="mt-6 inline-flex items-center px-6 py-3 rounded-lg bg-amber text-navy-dark font-semibold hover:bg-amber-light transition-colors">
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link key={property.id} href={`/dashboard/properties/${property.id}`} className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all overflow-hidden">
              <div className="h-2 w-full" style={{ backgroundColor: ragColors[complianceMap[property.id]] === 'bg-red-500' ? '#ef4444' : complianceMap[property.id] === 'amber' ? '#f59e0b' : complianceMap[property.id] === 'green' ? '#22c55e' : '#94a3b8' }} />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-navy dark:text-white">{property.address}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{property.postcode}</p>
                  </div>
                  <StatusBadge status={property.status} />
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>{property.type}</span>
                  {property.bedrooms > 0 && <span>{property.bedrooms} bed</span>}
                  {property.bathrooms > 0 && <span>{property.bathrooms} bath</span>}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${ragColors[complianceMap[property.id]]}`} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {complianceMap[property.id] === 'red' ? 'Non-compliant' : complianceMap[property.id] === 'amber' ? 'Expiring soon' : complianceMap[property.id] === 'green' ? 'Compliant' : 'No certificates'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {(property as unknown as { _count: { certificates: number } })._count.certificates} certs
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
