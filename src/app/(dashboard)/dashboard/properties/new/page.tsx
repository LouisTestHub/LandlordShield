'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    address: '', postcode: '', type: 'house', bedrooms: 1, bathrooms: 1,
    epcRating: '', councilTaxBand: '', purchaseDate: '', purchasePrice: '',
    currentValue: '', mortgageProvider: '', mortgageRate: '', status: 'active', notes: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
          currentValue: form.currentValue ? Number(form.currentValue) : null,
          mortgageRate: form.mortgageRate ? Number(form.mortgageRate) : null,
          purchaseDate: form.purchaseDate || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create property');
        setLoading(false);
        return;
      }

      const property = await res.json();
      router.push(`/dashboard/properties/${property.id}`);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">Add Property</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your property details to start tracking compliance.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>
        )}

        {/* Address */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Address</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Full address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required className={inputClass} placeholder="123 High Street, London" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Postcode</label>
                <input type="text" value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value.toUpperCase() })} required className={inputClass} placeholder="SW1A 1AA" />
              </div>
              <div>
                <label className={labelClass}>Property type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                  <option value="house">House</option>
                  <option value="flat">Flat</option>
                  <option value="HMO">HMO</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Property Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <input type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>EPC Rating</label>
              <select value={form.epcRating} onChange={(e) => setForm({ ...form, epcRating: e.target.value })} className={inputClass}>
                <option value="">Select</option>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Council Tax Band</label>
              <select value={form.councilTaxBand} onChange={(e) => setForm({ ...form, councilTaxBand: e.target.value })} className={inputClass}>
                <option value="">Select</option>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="active">Active</option>
                <option value="vacant">Vacant</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Financials (optional)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Purchase date</label>
              <input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Purchase price (£)</label>
              <input type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} className={inputClass} placeholder="250000" />
            </div>
            <div>
              <label className={labelClass}>Current value (£)</label>
              <input type="number" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} className={inputClass} placeholder="300000" />
            </div>
            <div>
              <label className={labelClass}>Mortgage provider</label>
              <input type="text" value={form.mortgageProvider} onChange={(e) => setForm({ ...form, mortgageProvider: e.target.value })} className={inputClass} placeholder="NatWest" />
            </div>
            <div>
              <label className={labelClass}>Mortgage rate (%)</label>
              <input type="number" step="0.01" value={form.mortgageRate} onChange={(e) => setForm({ ...form, mortgageRate: e.target.value })} className={inputClass} placeholder="4.5" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Notes</h2>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} className={inputClass} placeholder="Any additional notes about this property..." />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-amber text-navy-dark font-bold hover:bg-amber-light transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Property'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
