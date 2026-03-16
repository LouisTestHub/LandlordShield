'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NewTenancyPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-slate-500">Loading...</div></div>}>
      <NewTenancyPage />
    </Suspense>
  );
}

function NewTenancyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState<Array<{ id: string; address: string; postcode: string }>>([]);
  const [tenants, setTenants] = useState<Array<{ id: string; name: string; email: string | null }>>([]);
  const [form, setForm] = useState({
    propertyId: searchParams.get('propertyId') || '',
    tenantId: '',
    startDate: '',
    endDate: '',
    rentAmount: '',
    rentFrequency: 'monthly',
    paymentMethod: 'bank_transfer',
    depositAmount: '',
    depositScheme: '',
    depositReference: '',
    depositProtectedDate: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/properties').then((r) => r.json()).then(setProperties).catch(() => {});
    fetch('/api/tenants').then((r) => r.json()).then(setTenants).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tenancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create tenancy');
        setLoading(false);
        return;
      }

      const tenancy = await res.json();
      router.push(`/dashboard/tenancies/${tenancy.id}`);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">New Tenancy</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Link a property and tenant together.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Property & Tenant</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Property *</label>
              <select value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} required className={inputClass}>
                <option value="">Select property</option>
                {properties.map((p) => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tenant *</label>
              <select value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} required className={inputClass}>
                <option value="">Select tenant</option>
                {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Tenancy Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start date *</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>End date (blank = periodic)</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Rent amount (£) *</label>
              <input type="number" step="0.01" value={form.rentAmount} onChange={(e) => setForm({ ...form, rentAmount: e.target.value })} required className={inputClass} placeholder="1200" />
            </div>
            <div>
              <label className={labelClass}>Frequency</label>
              <select value={form.rentFrequency} onChange={(e) => setForm({ ...form, rentFrequency: e.target.value })} className={inputClass}>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Payment method</label>
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className={inputClass}>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="standing_order">Standing Order</option>
                <option value="direct_debit">Direct Debit</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Deposit Protection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Deposit amount (£)</label>
              <input type="number" step="0.01" value={form.depositAmount} onChange={(e) => setForm({ ...form, depositAmount: e.target.value })} className={inputClass} placeholder="1200" />
            </div>
            <div>
              <label className={labelClass}>Protection scheme</label>
              <select value={form.depositScheme} onChange={(e) => setForm({ ...form, depositScheme: e.target.value })} className={inputClass}>
                <option value="">Select scheme</option>
                <option value="DPS">DPS (Deposit Protection Service)</option>
                <option value="TDS">TDS (Tenancy Deposit Scheme)</option>
                <option value="MyDeposits">MyDeposits</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Reference number</label>
              <input type="text" value={form.depositReference} onChange={(e) => setForm({ ...form, depositReference: e.target.value })} className={inputClass} placeholder="DPS-12345678" />
            </div>
            <div>
              <label className={labelClass}>Date protected</label>
              <input type="date" value={form.depositProtectedDate} onChange={(e) => setForm({ ...form, depositProtectedDate: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Notes</h2>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={inputClass} placeholder="Any additional notes..." />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-amber text-navy-dark font-bold hover:bg-amber-light transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Tenancy'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
