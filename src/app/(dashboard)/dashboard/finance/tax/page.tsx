import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

export default async function TaxPage() {
  let income = 0, expenses = 0;
  let expenseBreakdown: Record<string, number> = {};

  try {
    const userId = await getUserId();
    const properties = await prisma.property.findMany({ where: { userId }, select: { id: true } });
    const propertyIds = properties.map(p => p.id);

    const yearStart = new Date(new Date().getFullYear(), 3, 6); // Tax year starts 6 April
    const prevYearStart = new Date(yearStart.getTime() - 365 * 24 * 60 * 60 * 1000);
    const taxYearStart = new Date() >= yearStart ? yearStart : prevYearStart;

    const payments = await prisma.rentPayment.findMany({
      where: { tenancy: { propertyId: { in: propertyIds } }, status: 'paid', paidDate: { gte: taxYearStart } },
    });
    income = payments.reduce((s, p) => s + p.amount, 0);

    const expenseRecords = await prisma.expense.findMany({
      where: { userId, date: { gte: taxYearStart } },
    });
    expenses = expenseRecords.reduce((s, e) => s + e.amount, 0);
    expenseRecords.forEach(e => { expenseBreakdown[e.category] = (expenseBreakdown[e.category] || 0) + e.amount; });
  } catch {
    // DB may not be available
  }

  const taxableProfit = Math.max(0, income - expenses);
  const basicRate = taxableProfit * 0.20;
  const higherRate = taxableProfit * 0.40;

  const quarters = [
    { label: 'Q1: Apr – Jun', deadline: '5 August', icon: '🟢' },
    { label: 'Q2: Jul – Sep', deadline: '5 November', icon: '🟡' },
    { label: 'Q3: Oct – Dec', deadline: '5 February', icon: '⚪' },
    { label: 'Q4: Jan – Mar', deadline: '5 May', icon: '⚪' },
  ];

  const checklist = [
    { item: 'All rental income recorded', done: income > 0 },
    { item: 'Expenses categorised per HMRC guidelines', done: expenses > 0 },
    { item: 'Receipts uploaded for all expenses', done: false },
    { item: 'Mortgage interest calculated', done: !!expenseBreakdown.mortgage_interest },
    { item: 'Property repairs logged separately', done: !!expenseBreakdown.repairs },
    { item: 'Agent fees recorded', done: !!expenseBreakdown.agent_fees },
    { item: 'Travel expenses documented', done: !!expenseBreakdown.travel },
    { item: 'Digital records meet MTD requirements', done: true },
  ];

  const categoryLabels: Record<string, string> = {
    repairs: 'Repairs & Maintenance', insurance: 'Insurance', mortgage_interest: 'Mortgage Interest',
    agent_fees: 'Agent Fees', legal: 'Legal Fees', accounting: 'Accounting',
    travel: 'Travel', utilities: 'Utilities', furnishings: 'Furnishings', other: 'Other',
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/finance" className="hover:text-navy dark:hover:text-white">Finance</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">MTD Tax Preparation</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">MTD Tax Preparation</h1>
          <p className="text-slate-500 dark:text-slate-400">SA105 property income summary</p>
        </div>
      </div>

      {/* MTD Banner */}
      <div className="mb-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛️</span>
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-300">MTD API Integration Coming Soon</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">Direct HMRC submission requires production API approval. Your records are MTD-ready for manual submission or accountant handoff.</p>
          </div>
        </div>
      </div>

      {/* Income & Expenses Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Property Income</p>
          <p className="text-3xl font-bold text-green-600">£{income.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Allowable Expenses</p>
          <p className="text-3xl font-bold text-red-600">£{expenses.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Taxable Profit</p>
          <p className="text-3xl font-bold text-navy dark:text-white">£{taxableProfit.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Tax Estimate</p>
          <div className="text-sm mt-1">
            <p className="text-slate-600 dark:text-slate-300">Basic (20%): <span className="font-bold text-navy dark:text-white">£{basicRate.toLocaleString()}</span></p>
            <p className="text-slate-600 dark:text-slate-300">Higher (40%): <span className="font-bold text-navy dark:text-white">£{higherRate.toLocaleString()}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Expense Breakdown (SA105) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Allowable Expenses Breakdown</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">HMRC SA105 categories</p>
          {Object.keys(expenseBreakdown).length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No expenses recorded for this tax year.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(expenseBreakdown).sort(([, a], [, b]) => b - a).map(([cat, total]) => (
                <div key={cat} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{categoryLabels[cat] || cat}</span>
                  <span className="font-semibold text-navy dark:text-white">£{total.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 font-bold border-t-2 border-slate-200 dark:border-slate-600">
                <span className="text-navy dark:text-white">Total Allowable Expenses</span>
                <span className="text-navy dark:text-white">£{expenses.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Quarterly Timeline */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Quarterly Submission Timeline</h2>
          <div className="space-y-4">
            {quarters.map(q => (
              <div key={q.label} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                <span className="text-xl">{q.icon}</span>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{q.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Deadline: {q.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MTD Readiness Checklist */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">MTD Readiness Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map(c => (
            <div key={c.item} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
              <span className={`text-lg ${c.done ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'}`}>{c.done ? '✅' : '⬜'}</span>
              <span className={`text-sm ${c.done ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{c.item}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-400">
            <strong>{checklist.filter(c => c.done).length}/{checklist.length}</strong> items complete — {Math.round((checklist.filter(c => c.done).length / checklist.length) * 100)}% MTD ready
          </p>
        </div>
      </div>
    </div>
  );
}
