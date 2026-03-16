'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tenancy {
  id: string; rentAmount: number;
  property: { address: string };
  tenant: { name: string };
}

interface RentIncrease {
  id: string; currentRent: number; proposedRent: number; increaseDate: string;
  noticeServedDate: string | null; method: string; status: string;
  marketRentEvidence: string | null; tribunalDate: string | null; tribunalOutcome: string | null;
  tenancy: { property: { address: string }; tenant: { name: string } };
}

export default function RentIncreasesPage() {
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);
  const [increases, setIncreases] = useState<RentIncrease[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    tenancyId: '', currentRent: '', proposedRent: '', increaseDate: '',
    method: 'section13', marketRentEvidence: '', notes: '',
  });

  // Calculator state
  const [calcCurrentRent, setCalcCurrentRent] = useState('');
  const [calcPercentage, setCalcPercentage] = useState('5');

  useEffect(() => {
    Promise.all([
      fetch('/api/tenancies').then((r) => r.json()),
      fetch('/api/rent/increases').then((r) => r.json()),
    ]).then(([t, i]) => {
      setTenancies(t);
      setIncreases(i);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/rent/increases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create rent increase');
        setSubmitting(false);
        return;
      }

      const increase = await res.json();
      setIncreases((prev) => [increase, ...prev]);
      setShowForm(false);
      setForm({ tenancyId: '', currentRent: '', proposedRent: '', increaseDate: '', method: 'section13', marketRentEvidence: '', notes: '' });
    } catch {
      setError('Something went wrong');
    }
    setSubmitting(false);
  }

  const calculatedRent = calcCurrentRent ? (Number(calcCurrentRent) * (1 + Number(calcPercentage) / 100)).toFixed(2) : '0.00';

  const statusColors: Record<string, string> = {
    proposed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    served: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    challenged: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    tribunal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none';

  if (loading) return <div className="flex items-center justify-center py-16"><div className="text-slate-500">Loading...</div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Rent Increases</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage rent increases under the Renters&apos; Rights Act</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + New Rent Increase
        </button>
      </div>

      {/* Rent Increase Calculator */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">📊 Rent Increase Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current rent (£/mo)</label>
            <input type="number" value={calcCurrentRent} onChange={(e) => setCalcCurrentRent(e.target.value)} className={inputClass} placeholder="1200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Increase (%)</label>
            <input type="number" step="0.1" value={calcPercentage} onChange={(e) => setCalcPercentage(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New rent</label>
            <div className="px-4 py-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 font-bold">
              £{calculatedRent}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly increase</label>
            <div className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-navy dark:text-white font-medium">
              +£{calcCurrentRent ? (Number(calculatedRent) - Number(calcCurrentRent)).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            <strong>Renters&apos; Rights Act rules:</strong> Minimum 2 months&apos; notice required. Maximum frequency: once per 12 months.
            Rent must not exceed market rate. Tenant can challenge at First-tier Tribunal.
          </p>
        </div>
      </div>

      {/* Section 13 Info */}
      <div className="bg-navy/5 dark:bg-navy/20 border border-navy/20 dark:border-navy/40 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-3">📋 Section 13 Notice — Key Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>✓ Must use prescribed Form 4 (Section 13(2))</li>
            <li>✓ Minimum 2 months&apos; notice before increase date</li>
            <li>✓ Maximum once per 12-month period</li>
            <li>✓ Must be at or below market rent</li>
          </ul>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>✓ Tenant has right to refer to First-tier Tribunal</li>
            <li>✓ Tribunal determines market rent (may go up or down)</li>
            <li>✓ If not challenged, increase takes effect on specified date</li>
            <li>✓ No backdating allowed under Renters&apos; Rights Act</li>
          </ul>
        </div>
      </div>

      {/* Tribunal Prep Checklist */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-3">⚖️ Tribunal Preparation Checklist</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">If a tenant challenges your rent increase, prepare the following:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'Comparable rental evidence (3+ similar properties)',
            'Property condition report with photos',
            'Details of improvements made',
            'Copy of Section 13 notice served',
            'Proof of service (recorded delivery receipt)',
            'Current tenancy agreement',
            'Local market rent data (Rightmove, Zoopla)',
            'Council Tax banding information',
          ].map((item) => (
            <label key={item} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-amber focus:ring-amber" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* New Increase Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-amber p-6 mb-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">New Rent Increase</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 text-sm">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tenancy *</label>
                <select value={form.tenancyId} onChange={(e) => {
                  const t = tenancies.find((t) => t.id === e.target.value);
                  setForm({ ...form, tenancyId: e.target.value, currentRent: t ? String(t.rentAmount) : '' });
                }} required className={inputClass}>
                  <option value="">Select tenancy</option>
                  {tenancies.map((t) => <option key={t.id} value={t.id}>{t.property.address} — {t.tenant.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Method</label>
                <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inputClass}>
                  <option value="section13">Section 13 Notice</option>
                  <option value="agreement">By Agreement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current rent (£) *</label>
                <input type="number" step="0.01" value={form.currentRent} onChange={(e) => setForm({ ...form, currentRent: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Proposed rent (£) *</label>
                <input type="number" step="0.01" value={form.proposedRent} onChange={(e) => setForm({ ...form, proposedRent: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Increase effective date *</label>
                <input type="date" value={form.increaseDate} onChange={(e) => setForm({ ...form, increaseDate: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Market rent evidence</label>
                <input type="text" value={form.marketRentEvidence} onChange={(e) => setForm({ ...form, marketRentEvidence: e.target.value })} className={inputClass} placeholder="URL or description" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-lg bg-amber text-navy-dark font-bold hover:bg-amber-light transition-colors disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create Rent Increase'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Existing increases */}
      {increases.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-4xl">📈</span>
          <h2 className="mt-4 text-lg font-semibold text-navy dark:text-white">No rent increases recorded</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create a rent increase to track the process.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Property</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Current</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Proposed</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Method</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {increases.map((inc) => (
                <tr key={inc.id} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-navy dark:text-white">{inc.tenancy.property.address}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{inc.tenancy.tenant.name}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">£{inc.currentRent}</td>
                  <td className="py-3 px-4 font-medium text-navy dark:text-white">£{inc.proposedRent}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{inc.method === 'section13' ? 'Section 13' : 'Agreement'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[inc.status] || 'bg-slate-100 text-slate-600'}`}>
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
