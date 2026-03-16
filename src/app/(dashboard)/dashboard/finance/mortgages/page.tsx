'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Mortgage {
  id: string;
  provider: string;
  accountNumber: string | null;
  type: string;
  interestRate: number;
  monthlyPayment: number;
  outstandingBalance: number | null;
  startDate: string;
  endDate: string;
  notes: string | null;
  property: { address: string; postcode: string };
}

const typeLabels: Record<string, string> = { fixed: 'Fixed', variable: 'Variable', tracker: 'Tracker' };
const typeColors: Record<string, string> = {
  fixed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  variable: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  tracker: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function MortgagesPage() {
  const [mortgages, setMortgages] = useState<Mortgage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [properties, setProperties] = useState<{ id: string; address: string }[]>([]);
  const [form, setForm] = useState({ propertyId: '', provider: '', accountNumber: '', type: 'fixed', interestRate: '', monthlyPayment: '', outstandingBalance: '', startDate: '', endDate: '', notes: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/mortgages').then(r => r.json()),
      fetch('/api/properties').then(r => r.json()),
    ]).then(([morts, props]) => {
      setMortgages(Array.isArray(morts) ? morts : []);
      setProperties(Array.isArray(props) ? props : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/mortgages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const mort = await res.json();
      const prop = properties.find(p => p.id === form.propertyId);
      setMortgages([{ ...mort, property: prop ? { address: prop.address, postcode: '' } : { address: '', postcode: '' } }, ...mortgages]);
      setShowForm(false);
    }
  }

  const totalMonthly = mortgages.reduce((s, m) => s + m.monthlyPayment, 0);
  const totalBalance = mortgages.reduce((s, m) => s + (m.outstandingBalance || 0), 0);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/finance" className="hover:text-navy dark:hover:text-white">Finance</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">Mortgages</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Mortgages</h1>
          <p className="text-slate-500 dark:text-slate-400">{mortgages.length} mortgage{mortgages.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Add Mortgage
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Monthly Payments</p>
          <p className="text-3xl font-bold text-navy dark:text-white">£{totalMonthly.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Annual Cost</p>
          <p className="text-3xl font-bold text-navy dark:text-white">£{(totalMonthly * 12).toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Outstanding</p>
          <p className="text-3xl font-bold text-navy dark:text-white">£{totalBalance.toLocaleString()}</p>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Add Mortgage</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property *</label>
              <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                <option value="">Select property</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Provider *</label>
              <input type="text" value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" placeholder="e.g. Nationwide" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                <option value="fixed">Fixed</option>
                <option value="variable">Variable</option>
                <option value="tracker">Tracker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%) *</label>
              <input type="number" step="0.01" value={form.interestRate} onChange={e => setForm({ ...form, interestRate: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Payment (£) *</label>
              <input type="number" step="0.01" value={form.monthlyPayment} onChange={e => setForm({ ...form, monthlyPayment: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Outstanding Balance (£)</label>
              <input type="number" step="0.01" value={form.outstandingBalance} onChange={e => setForm({ ...form, outstandingBalance: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date *</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">Save Mortgage</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {mortgages.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">🏦</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No mortgages tracked</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Add your mortgage details to track payments and remortgage dates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mortgages.map(m => {
            const daysToEnd = Math.ceil((new Date(m.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return (
              <div key={m.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-navy dark:text-white">{m.provider}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{m.property.address}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[m.type]}`}>{typeLabels[m.type]}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Rate</p>
                    <p className="font-semibold text-navy dark:text-white">{m.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Payment</p>
                    <p className="font-semibold text-navy dark:text-white">£{m.monthlyPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Deal Ends</p>
                    <p className={`font-semibold ${daysToEnd <= 90 ? 'text-red-600 dark:text-red-400' : 'text-navy dark:text-white'}`}>
                      {new Date(m.endDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  {m.outstandingBalance && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Outstanding</p>
                      <p className="font-semibold text-navy dark:text-white">£{m.outstandingBalance.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                {daysToEnd <= 90 && daysToEnd > 0 && (
                  <div className="mt-4 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-xs font-medium text-red-700 dark:text-red-400">⚠️ Deal ends in {daysToEnd} days — time to remortgage</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
