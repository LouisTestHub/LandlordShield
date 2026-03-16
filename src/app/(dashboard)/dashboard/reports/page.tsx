import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';
import { PrintButton } from '@/components/dashboard/PrintButton';

export default async function ReportsPage() {
  let portfolioData = { properties: 0, tenants: 0, totalValue: 0, monthlyIncome: 0, occupancy: 0 };
  let complianceData = { total: 0, valid: 0, expiring: 0, expired: 0 };
  let financialData = { income: 0, expenses: 0, net: 0 };
  let properties: { id: string; address: string; postcode: string; type: string; currentValue: number | null; status: string }[] = [];

  try {
    const userId = await getUserId();
    const props = await prisma.property.findMany({
      where: { userId },
      include: {
        tenancies: { where: { status: 'active' } },
        certificates: true,
      },
    });
    const propertyIds = props.map(p => p.id);

    properties = props.map(p => ({ id: p.id, address: p.address, postcode: p.postcode, type: p.type, currentValue: p.currentValue, status: p.status }));
    portfolioData.properties = props.length;
    portfolioData.totalValue = props.reduce((s, p) => s + (p.currentValue || 0), 0);
    portfolioData.monthlyIncome = props.reduce((s, p) => s + p.tenancies.reduce((ts, t) => ts + t.rentAmount, 0), 0);
    const tenantIds = new Set<string>();
    props.forEach(p => p.tenancies.forEach(t => tenantIds.add(t.tenantId)));
    portfolioData.tenants = tenantIds.size;
    portfolioData.occupancy = props.length > 0 ? Math.round((props.filter(p => p.tenancies.length > 0).length / props.length) * 100) : 0;

    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const allCerts = props.flatMap(p => p.certificates);
    complianceData.total = allCerts.length;
    complianceData.expired = allCerts.filter(c => c.expiryDate < now).length;
    complianceData.expiring = allCerts.filter(c => c.expiryDate >= now && c.expiryDate <= thirtyDays).length;
    complianceData.valid = allCerts.filter(c => c.expiryDate >= now).length;

    const yearStart = new Date(now.getFullYear(), 0, 1);
    const payments = await prisma.rentPayment.findMany({
      where: { tenancy: { propertyId: { in: propertyIds } }, status: 'paid', paidDate: { gte: yearStart } },
    });
    financialData.income = payments.reduce((s, p) => s + p.amount, 0);
    const expenses = await prisma.expense.findMany({ where: { userId, date: { gte: yearStart } } });
    financialData.expenses = expenses.reduce((s, e) => s + e.amount, 0);
    financialData.net = financialData.income - financialData.expenses;
  } catch {
    // DB may not be available
  }

  const reports = [
    {
      title: 'Portfolio Overview',
      icon: '🏘️',
      description: 'All properties, values, income, and compliance status',
      stats: [
        { label: 'Properties', value: portfolioData.properties.toString() },
        { label: 'Portfolio Value', value: `£${portfolioData.totalValue.toLocaleString()}` },
        { label: 'Monthly Income', value: `£${portfolioData.monthlyIncome.toLocaleString()}` },
        { label: 'Occupancy', value: `${portfolioData.occupancy}%` },
      ],
    },
    {
      title: 'Compliance Report',
      icon: '📜',
      description: 'All certificates, status, and expiry dates',
      stats: [
        { label: 'Total Certificates', value: complianceData.total.toString() },
        { label: 'Valid', value: complianceData.valid.toString() },
        { label: 'Expiring (30d)', value: complianceData.expiring.toString() },
        { label: 'Expired', value: complianceData.expired.toString() },
      ],
    },
    {
      title: 'Financial Report',
      icon: '💷',
      description: 'Income, expenses, and tax summary for the year',
      stats: [
        { label: 'Total Income', value: `£${financialData.income.toLocaleString()}` },
        { label: 'Total Expenses', value: `£${financialData.expenses.toLocaleString()}` },
        { label: 'Net Profit', value: `£${financialData.net.toLocaleString()}` },
        { label: 'Tenants', value: portfolioData.tenants.toString() },
      ],
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">Reports</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Reports</h1>
          <p className="text-slate-500 dark:text-slate-400">Generate and view portfolio reports</p>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {reports.map(report => (
          <div key={report.title} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{report.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-navy dark:text-white">{report.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{report.description}</p>
                </div>
              </div>
              <PrintButton />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {report.stats.map(stat => (
                <div key={stat.label} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-xl font-bold text-navy dark:text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Property Report Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Property Summary</h2>
        {properties.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No properties to report.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {properties.map(p => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-sm font-medium text-navy dark:text-white">{p.address}, {p.postcode}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 capitalize">{p.type}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 capitalize">{p.status}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-navy dark:text-white">{p.currentValue ? `£${p.currentValue.toLocaleString()}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`@media print { .print\\:hidden { display: none !important; } nav, aside, header { display: none !important; } main { padding: 0 !important; } }`}</style>
    </div>
  );
}
