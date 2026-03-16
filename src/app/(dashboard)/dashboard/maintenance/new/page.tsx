'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewMaintenancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<{ id: string; address: string }[]>([]);
  const [tenancies, setTenancies] = useState<{ id: string; tenant: { name: string }; propertyId: string }[]>([]);
  const [form, setForm] = useState({
    propertyId: '', tenancyId: '', title: '', description: '', priority: 'medium', contractor: '', notes: '',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/properties').then(r => r.json()),
      fetch('/api/tenancies').then(r => r.json()),
    ]).then(([props, tens]) => {
      setProperties(Array.isArray(props) ? props : []);
      setTenancies(Array.isArray(tens) ? tens : []);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push('/dashboard/maintenance');
    else setLoading(false);
  }

  const filteredTenancies = form.propertyId ? tenancies.filter(t => t.propertyId === form.propertyId) : tenancies;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/maintenance" className="hover:text-navy dark:hover:text-white">Maintenance</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">New Request</span>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-navy dark:text-white mb-8">Log Maintenance Request</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property *</label>
            <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
              <option value="">Select property</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tenancy</label>
            <select value={form.tenancyId} onChange={e => setForm({ ...form, tenancyId: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
              <option value="">None</option>
              {filteredTenancies.map(t => <option key={t.id} value={t.id}>{t.tenant.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" placeholder="e.g. Boiler not heating water" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority *</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                <option value="emergency">🔴 Emergency</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contractor</label>
              <input type="text" value={form.contractor} onChange={e => setForm({ ...form, contractor: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors disabled:opacity-50 dark:bg-amber dark:text-navy-dark">{loading ? 'Saving...' : 'Log Request'}</button>
            <Link href="/dashboard/maintenance" className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
