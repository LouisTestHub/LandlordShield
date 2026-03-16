'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dateOfBirth: '', nationality: '',
    rightToRentChecked: false, rightToRentExpiry: '',
    emergencyContact: '', emergencyPhone: '', notes: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create tenant');
        setLoading(false);
        return;
      }

      const tenant = await res.json();
      router.push(`/dashboard/tenants/${tenant.id}`);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">Add Tenant</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Enter tenant details.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Full name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} placeholder="John Smith" />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="john@example.com" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="07700 900000" />
            </div>
            <div>
              <label className={labelClass}>Date of birth</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nationality</label>
              <input type="text" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} className={inputClass} placeholder="British" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Right to Rent</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="rightToRent" checked={form.rightToRentChecked} onChange={(e) => setForm({ ...form, rightToRentChecked: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-amber focus:ring-amber" />
              <label htmlFor="rightToRent" className="text-sm font-medium text-slate-700 dark:text-slate-300">Right to Rent check completed</label>
            </div>
            <div>
              <label className={labelClass}>Expiry date (if applicable)</label>
              <input type="date" value={form.rightToRentExpiry} onChange={(e) => setForm({ ...form, rightToRentExpiry: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Contact name</label>
              <input type="text" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} className={inputClass} placeholder="Jane Smith" />
            </div>
            <div>
              <label className={labelClass}>Contact phone</label>
              <input type="tel" value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} className={inputClass} placeholder="07700 900001" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Notes</h2>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={inputClass} placeholder="Any additional notes..." />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-amber text-navy-dark font-bold hover:bg-amber-light transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Tenant'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
