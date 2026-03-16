import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

export default async function DashboardPage() {
  let stats = {
    properties: 0, tenants: 0, activeTenancies: 0, occupancyRate: 0, monthlyIncome: 0,
    expiredCerts: 0, expiringCerts: 0, totalCerts: 0, complianceScore: 0,
    thisMonthIncome: 0, thisMonthExpenses: 0, lastMonthIncome: 0, lastMonthExpenses: 0,
    overduePayments: 0, openMaintenance: 0,
  };
  let recentActivity: { id: string; action: string; entity: string; details: string | null; createdAt: Date }[] = [];
  let upcomingTasks: { id: string; title: string; dueDate: Date; priority: string; type: string }[] = [];
  let propertyCards: { id: string; address: string; postcode: string; type: string; status: string; bedrooms: number; compliance: string; occupied: boolean; rent: number }[] = [];

  try {
    const userId = await getUserId();
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const properties = await prisma.property.findMany({
      where: { userId },
      include: {
        tenancies: { where: { status: 'active' }, include: { tenant: true } },
        certificates: true,
        _count: { select: { certificates: true, tenancies: true } },
      },
    });
    const propertyIds = properties.map(p => p.id);

    stats.properties = properties.length;
    stats.activeTenancies = properties.reduce((s, p) => s + p.tenancies.length, 0);
    stats.occupancyRate = properties.length > 0 ? Math.round((properties.filter(p => p.tenancies.length > 0).length / properties.length) * 100) : 0;

    // Unique tenants
    const tenantIds = new Set<string>();
    properties.forEach(p => p.tenancies.forEach(t => tenantIds.add(t.tenantId)));
    stats.tenants = tenantIds.size;

    // Monthly income from active tenancies
    stats.monthlyIncome = properties.reduce((s, p) => s + p.tenancies.reduce((ts, t) => ts + t.rentAmount, 0), 0);

    // Compliance
    const allCerts = properties.flatMap(p => p.certificates);
    stats.totalCerts = allCerts.length;
    stats.expiredCerts = allCerts.filter(c => c.expiryDate < now).length;
    stats.expiringCerts = allCerts.filter(c => c.expiryDate >= now && c.expiryDate <= thirtyDays).length;
    const validCerts = allCerts.filter(c => c.expiryDate >= now).length;
    stats.complianceScore = stats.totalCerts > 0 ? Math.round((validCerts / stats.totalCerts) * 100) : 0;

    // Financial - this month
    const thisMonthPayments = await prisma.rentPayment.findMany({
      where: { tenancy: { propertyId: { in: propertyIds } }, status: 'paid', paidDate: { gte: thisMonthStart } },
    });
    stats.thisMonthIncome = thisMonthPayments.reduce((s, p) => s + p.amount, 0);
    const thisMonthExpenses = await prisma.expense.findMany({
      where: { userId, date: { gte: thisMonthStart } },
    });
    stats.thisMonthExpenses = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);

    // Financial - last month
    const lastMonthPayments = await prisma.rentPayment.findMany({
      where: { tenancy: { propertyId: { in: propertyIds } }, status: 'paid', paidDate: { gte: lastMonthStart, lte: lastMonthEnd } },
    });
    stats.lastMonthIncome = lastMonthPayments.reduce((s, p) => s + p.amount, 0);
    const lastMonthExpenses = await prisma.expense.findMany({
      where: { userId, date: { gte: lastMonthStart, lte: lastMonthEnd } },
    });
    stats.lastMonthExpenses = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

    // Overdue
    stats.overduePayments = await prisma.rentPayment.count({
      where: { tenancy: { propertyId: { in: propertyIds } }, status: { in: ['missed', 'late'] } },
    });

    stats.openMaintenance = await prisma.maintenanceRequest.count({
      where: { propertyId: { in: propertyIds }, status: { in: ['reported', 'acknowledged', 'in_progress'] } },
    });

    // Recent activity
    recentActivity = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Upcoming tasks (next 7 days)
    const tasks = await prisma.complianceTask.findMany({
      where: { propertyId: { in: propertyIds }, status: { not: 'completed' }, dueDate: { lte: sevenDays } },
      orderBy: { dueDate: 'asc' },
      take: 10,
    });
    upcomingTasks = tasks.map(t => ({ id: t.id, title: t.title, dueDate: t.dueDate, priority: t.priority, type: 'task' }));

    // Expiring certs as upcoming items
    const expiringCerts = allCerts.filter(c => c.expiryDate >= now && c.expiryDate <= sevenDays);
    expiringCerts.forEach(c => {
      upcomingTasks.push({ id: c.id, title: `${c.type.replace(/_/g, ' ')} certificate expires`, dueDate: c.expiryDate, priority: 'high', type: 'cert' });
    });
    upcomingTasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    // Property cards
    propertyCards = properties.map(p => {
      const expired = p.certificates.filter(c => c.expiryDate < now).length;
      const expiring = p.certificates.filter(c => c.expiryDate >= now && c.expiryDate <= thirtyDays).length;
      let compliance = 'green';
      if (expired > 0) compliance = 'red';
      else if (expiring > 0) compliance = 'amber';
      else if (p.certificates.length === 0) compliance = 'grey';

      return {
        id: p.id, address: p.address, postcode: p.postcode, type: p.type,
        status: p.status, bedrooms: p.bedrooms, compliance,
        occupied: p.tenancies.length > 0,
        rent: p.tenancies.reduce((s, t) => s + t.rentAmount, 0),
      };
    });
  } catch {
    // DB might not be available
  }

  const ragColors: Record<string, string> = { red: 'bg-red-500', amber: 'bg-amber-500', green: 'bg-green-500', grey: 'bg-slate-300 dark:bg-slate-600' };
  const ragLabels: Record<string, string> = { red: 'Non-compliant', amber: 'Expiring soon', green: 'Compliant', grey: 'No certificates' };

  const thisMonthNet = stats.thisMonthIncome - stats.thisMonthExpenses;
  const lastMonthNet = stats.lastMonthIncome - stats.lastMonthExpenses;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Your portfolio at a glance</p>
        </div>
        <Link href="/dashboard/properties/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark dark:hover:bg-amber-light">
          + Add Property
        </Link>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Properties</p>
          <p className="text-3xl font-bold text-navy dark:text-white">{stats.properties}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Tenants</p>
          <p className="text-3xl font-bold text-navy dark:text-white">{stats.tenants}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Occupancy Rate</p>
          <p className="text-3xl font-bold text-green-600">{stats.occupancyRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Income</p>
          <p className="text-3xl font-bold text-green-600">£{stats.monthlyIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Compliance & Financial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Compliance Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Compliance Overview</h2>
          <div className="flex items-center gap-6 mb-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="35" fill="none" stroke="#e2e8f0" strokeWidth="8" className="dark:stroke-slate-700" />
                <circle cx="40" cy="40" r="35" fill="none" stroke={stats.complianceScore >= 80 ? '#22c55e' : stats.complianceScore >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="8" strokeDasharray={`${(stats.complianceScore / 100) * 220} 220`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-navy dark:text-white">{stats.complianceScore}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300">{stats.expiredCerts} expired</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300">{stats.expiringCerts} expiring (30d)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300">{stats.totalCerts - stats.expiredCerts - stats.expiringCerts} valid</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/compliance" className="text-sm text-amber hover:text-amber-dark font-medium">View Calendar →</Link>
            <Link href="/dashboard/certificates" className="text-sm text-amber hover:text-amber-dark font-medium">All Certificates →</Link>
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Financial Snapshot</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">This Month Income</p>
              <p className="text-xl font-bold text-green-600">£{stats.thisMonthIncome.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">This Month Expenses</p>
              <p className="text-xl font-bold text-red-600">£{stats.thisMonthExpenses.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Net</p>
              <p className={`text-xl font-bold ${thisMonthNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>£{thisMonthNet.toLocaleString()}</p>
            </div>
          </div>
          {lastMonthNet !== 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              vs last month: £{lastMonthNet.toLocaleString()} ({thisMonthNet >= lastMonthNet ? '📈' : '📉'} {lastMonthNet !== 0 ? Math.round(((thisMonthNet - lastMonthNet) / Math.abs(lastMonthNet)) * 100) : 0}%)
            </p>
          )}
          <div className="mt-3 flex gap-4">
            {stats.overduePayments > 0 && (
              <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <span>⚠️</span> {stats.overduePayments} overdue payment{stats.overduePayments !== 1 ? 's' : ''}
              </div>
            )}
            {stats.openMaintenance > 0 && (
              <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                <span>🔧</span> {stats.openMaintenance} open maintenance
              </div>
            )}
          </div>
          <div className="mt-3">
            <Link href="/dashboard/finance" className="text-sm text-amber hover:text-amber-dark font-medium">View Finance →</Link>
          </div>
        </div>
      </div>

      {/* Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Upcoming (7 days)</h2>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming actions — all clear! ✅</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.slice(0, 8).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(task.dueDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(log => (
                <div key={log.id} className="flex items-start gap-3 p-2">
                  <div className="w-2 h-2 rounded-full bg-amber mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium">{log.action}</span> — {log.entity}
                    </p>
                    {log.details && <p className="text-xs text-slate-500 dark:text-slate-400">{log.details}</p>}
                    <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(log.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Properties</h2>
        {propertyCards.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-5xl">🏠</span>
            <h3 className="mt-4 text-lg font-semibold text-navy dark:text-white">No properties yet</h3>
            <Link href="/dashboard/properties/new" className="mt-4 inline-flex items-center px-6 py-3 rounded-lg bg-amber text-navy-dark font-semibold hover:bg-amber-light transition-colors">Add Your First Property</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyCards.map(p => (
              <Link key={p.id} href={`/dashboard/properties/${p.id}`} className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all overflow-hidden">
                <div className={`h-2 w-full ${ragColors[p.compliance]}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-navy dark:text-white">{p.address}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{p.postcode}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.occupied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {p.occupied ? 'Occupied' : 'Vacant'}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>{p.type}</span>
                    {p.bedrooms > 0 && <span>{p.bedrooms} bed</span>}
                    {p.rent > 0 && <span className="font-medium text-navy dark:text-white">£{p.rent.toLocaleString()}/mo</span>}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${ragColors[p.compliance]}`} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{ragLabels[p.compliance]}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
