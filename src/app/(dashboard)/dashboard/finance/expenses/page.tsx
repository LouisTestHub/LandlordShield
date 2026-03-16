'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  supplier: string | null;
  receiptUrl: string | null;
  notes: string | null;
  property: { address: string } | null;
}

const categoryLabels: Record<string, string> = {
  repairs: 'Repairs & Maintenance', insurance: 'Insurance', mortgage_interest: 'Mortgage Interest',
  agent_fees: 'Agent Fees', legal: 'Legal Fees', accounting: 'Accounting',
  travel: 'Travel', utilities: 'Utilities', furnishings: 'Furnishings', other: 'Other',
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [properties, setProperties] = useState<{ id: string; address: string }[]>([]);
  const [form, setForm] = useState({ category: 'repairs', description: '', amount: '', date: new Date().toISOString().split('T')[0], propertyId: '', supplier: '', notes: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/expenses').then(r => r.json()),
      fetch('/api/properties').then(r => r.json()),
    ]).then(([exps, props]) => {
      setExpenses(Array.isArray(exps) ? exps : []);
      setProperties(Array.isArray(props) ? props : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const exp = await res.json();
      const prop = properties.find(p => p.id === form.propertyId);
      setExpenses([{ ...exp, property: prop ? { address: prop.address } : null }, ...expenses]);
      setShowForm(false);
      setForm({ category: 'repairs', description: '', amount: '', date: new Date().toISOString().split('T')[0], propertyId: '', supplier: '', notes: '' });
    }
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/finance" className="hover:text-navy dark:hover:text-white">Finance</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">Expenses</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Expenses</h1>
          <p className="text-slate-500 dark:text-slate-400">Total: £{total.toLocaleString()} across {expenses.length} entries</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Add Expense
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (£) *</label>
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
              <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property</label>
              <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                <option value="">General (not property-specific)</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Supplier</label>
              <input type="text" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">Save Expense</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">🧾</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No expenses recorded</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Add your first expense to start tracking.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Description</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase hidden lg:table-cell">Property</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(exp.date).toLocaleDateString('en-GB')}</td>
                  <td className="px-6 py-4 text-sm font-medium text-navy dark:text-white">{exp.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">{categoryLabels[exp.category] || exp.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden lg:table-cell">{exp.property?.address || '—'}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-red-600 dark:text-red-400">£{exp.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
