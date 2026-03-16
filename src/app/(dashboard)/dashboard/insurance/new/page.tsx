'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewInsurancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<{ id: string; address: string }[]>([]);
  const [form, setForm] = useState({
    propertyId: '', provider: '', policyNumber: '', type: 'buildings',
    startDate: '', renewalDate: '', premium: '', excess: '', notes: '',
  });

  useEffect(() => {
    fetch('/api/properties').then(r => r.json()).then(d => setProperties(Array.isArray(d) ? d : []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/insurance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push('/dashboard/insurance');
    else setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/insurance" className="hover:text-navy dark:hover:text-white">Insurance</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">New Policy</span>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-navy dark:text-white mb-8">Add Insurance Policy</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property *</label>
              <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                <option value="">Select property</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                <option value="buildings">Buildings</option>
                <option value="contents">Contents</option>
                <option value="landlord">Landlord</option>
                <option value="rent_guarantee">Rent Guarantee</option>
                <option value="legal">Legal Protection</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Provider *</label>
              <input type="text" value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" placeholder="e.g. Aviva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Policy Number</label>
              <input type="text" value={form.policyNumber} onChange={e => setForm({ ...form, policyNumber: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Renewal Date *</label>
              <input type="date" value={form.renewalDate} onChange={e => setForm({ ...form, renewalDate: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Premium (£)</label>
              <input type="number" step="0.01" value={form.premium} onChange={e => setForm({ ...form, premium: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Excess (£)</label>
              <input type="number" step="0.01" value={form.excess} onChange={e => setForm({ ...form, excess: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors disabled:opacity-50 dark:bg-amber dark:text-navy-dark">{loading ? 'Saving...' : 'Add Policy'}</button>
            <Link href="/dashboard/insurance" className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
