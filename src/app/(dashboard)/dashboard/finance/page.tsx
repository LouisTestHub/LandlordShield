import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import Link from 'next/link';

export default async function FinancePage() {
  let income = 0, expenses = 0, mortgagePayments = 0;
  let monthlyIncome: { month: string; income: number; expenses: number }[] = [];
  let expensesByCategory: { category: string; total: number }[] = [];

  try {
    const userId = await getUserId();
    const properties = await prisma.property.findMany({ where: { userId }, select: { id: true } });
    const propertyIds = properties.map(p => p.id);

    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Rental income from paid rent payments this year
    const payments = await prisma.rentPayment.findMany({
      where: { tenancy: { propertyId: { in: propertyIds } }, status: 'paid', paidDate: { gte: yearStart } },
    });
    income = payments.reduce((sum, p) => sum + p.amount, 0);

    // Expenses this year
    const expenseRecords = await prisma.expense.findMany({
      where: { userId, date: { gte: yearStart } },
    });
    expenses = expenseRecords.reduce((sum, e) => sum + e.amount, 0);

    // Expenses by category
    const catMap: Record<string, number> = {};
    expenseRecords.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
    expensesByCategory = Object.entries(catMap).map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);

    // Mortgages
    const mortgages = await prisma.mortgage.findMany({ where: { propertyId: { in: propertyIds } } });
    mortgagePayments = mortgages.reduce((sum, m) => sum + m.monthlyPayment, 0);

    // Monthly breakdown (last 6 months)
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const mPayments = payments.filter(p => p.paidDate && p.paidDate >= mStart && p.paidDate <= mEnd);
      const mExpenses = expenseRecords.filter(e => e.date >= mStart && e.date <= mEnd);
      monthlyIncome.push({
        month: mStart.toLocaleDateString('en-GB', { month: 'short' }),
        income: mPayments.reduce((s, p) => s + p.amount, 0),
        expenses: mExpenses.reduce((s, e) => s + e.amount, 0),
      });
    }
  } catch {
    // DB may not be available
  }

  const net = income - expenses;
  const maxBar = Math.max(...monthlyIncome.map(m => Math.max(m.income, m.expenses)), 1);

  const categoryLabels: Record<string, string> = {
    repairs: 'Repairs & Maintenance', insurance: 'Insurance', mortgage_interest: 'Mortgage Interest',
    agent_fees: 'Agent Fees', legal: 'Legal Fees', accounting: 'Accounting', travel: 'Travel',
    utilities: 'Utilities', furnishings: 'Furnishings', other: 'Other',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Finance</h1>
          <p className="text-slate-500 dark:text-slate-400">Financial overview for {new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Rental Income (YTD)</p>
          <p className="text-3xl font-bold text-green-600">£{income.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Expenses (YTD)</p>
          <p className="text-3xl font-bold text-red-600">£{expenses.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Net Profit/Loss</p>
          <p className={`text-3xl font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>£{net.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Mortgages</p>
          <p className="text-3xl font-bold text-navy dark:text-white">£{mortgagePayments.toLocaleString()}</p>
        </div>
      </div>

      {/* Cash flow chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Cash Flow (Last 6 Months)</h2>
        <div className="flex items-end gap-4 h-48">
          {monthlyIncome.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end" style={{ height: '160px' }}>
                <div className="flex-1 bg-green-500 rounded-t" style={{ height: `${(m.income / maxBar) * 160}px`, minHeight: m.income > 0 ? '4px' : '0' }} />
                <div className="flex-1 bg-red-400 rounded-t" style={{ height: `${(m.expenses / maxBar) * 160}px`, minHeight: m.expenses > 0 ? '4px' : '0' }} />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{m.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded" /><span className="text-xs text-slate-500 dark:text-slate-400">Income</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded" /><span className="text-xs text-slate-500 dark:text-slate-400">Expenses</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Expenses by Category */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Expenses by Category</h2>
          {expensesByCategory.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {expensesByCategory.map(cat => (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300">{categoryLabels[cat.category] || cat.category}</span>
                    <span className="font-medium text-navy dark:text-white">£{cat.total.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-amber rounded-full h-2" style={{ width: `${(cat.total / (expensesByCategory[0]?.total || 1)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Finance Tools</h2>
          <div className="space-y-3">
            <Link href="/dashboard/finance/income" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <span className="text-xl">💰</span>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">Income Log</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track all rental income</p>
              </div>
            </Link>
            <Link href="/dashboard/finance/expenses" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <span className="text-xl">🧾</span>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">Expense Tracker</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">HMRC-compliant expense categories</p>
              </div>
            </Link>
            <Link href="/dashboard/finance/tax" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <span className="text-xl">📊</span>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">MTD Tax Preparation</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Quarterly submission prep</p>
              </div>
            </Link>
            <Link href="/dashboard/finance/mortgages" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <span className="text-xl">🏦</span>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">Mortgage Tracker</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track rates, payments, end dates</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
