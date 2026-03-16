'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tenancy {
  id: string; property: { address: string }; tenant: { name: string };
}

interface Notice {
  id: string; type: string; servedDate: string | null; effectiveDate: string | null;
  grounds: string | null; status: string; notes: string | null; createdAt: string;
  tenancy: { property: { address: string }; tenant: { name: string } };
}

const noticeTypes = [
  { value: 'section8', label: 'Section 8 — Possession (Fault-based)', description: 'Used when tenant has breached the tenancy agreement (rent arrears, anti-social behaviour, etc.)' },
  { value: 'section13', label: 'Section 13 — Rent Increase', description: 'Formal notice to increase rent. Minimum 2 months notice under Renters\' Rights Act.' },
  { value: 'rent_increase', label: 'Rent Increase (by agreement)', description: 'Rent increase agreed with tenant outside of Section 13 process.' },
  { value: 'intention_to_sell', label: 'Intention to Sell', description: 'New ground under Renters\' Rights Act. 4 months notice required. Cannot re-let for 12 months.' },
  { value: 'family_move_in', label: 'Family/Landlord Move-in', description: 'New ground under Renters\' Rights Act. 4 months notice. Landlord or close family member must occupy.' },
];

const section8Grounds = [
  { ground: 'Ground 1', title: 'Rent Arrears (Mandatory)', description: 'At least 2 months\' rent arrears at both notice date and hearing date. Minimum 2 weeks\' notice.', mandatory: true },
  { ground: 'Ground 2', title: 'Persistent Late Payment (Discretionary)', description: 'Tenant has been persistently late with rent payments over the last 3 years.', mandatory: false },
  { ground: 'Ground 3', title: 'Anti-Social Behaviour (Mandatory)', description: 'Tenant or visitors engaged in anti-social behaviour or criminal activity at the property.', mandatory: true },
  { ground: 'Ground 4', title: 'Damage to Property (Discretionary)', description: 'Tenant has caused damage to the property or common areas.', mandatory: false },
  { ground: 'Ground 5', title: 'Breach of Tenancy Terms (Discretionary)', description: 'Tenant has broken a term of the tenancy agreement (other than rent).', mandatory: false },
  { ground: 'Ground 6', title: 'Landlord Wants to Sell (Renters\' Rights Act)', description: 'Landlord intends to sell the property. 4 months\' notice. Cannot re-let for 12 months.', mandatory: true },
  { ground: 'Ground 7', title: 'Landlord/Family Move-in (Renters\' Rights Act)', description: 'Landlord or close family wants to live in the property. 4 months\' notice.', mandatory: true },
];

const noticeStatusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  served: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  acknowledged: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  court: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function NoticesPage() {
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    tenancyId: '', type: 'section8', servedDate: '', grounds: '', notes: '', status: 'draft',
  });

  // Effective date calculator
  const [calcServedDate, setCalcServedDate] = useState('');
  const [calcType, setCalcType] = useState('section8');

  useEffect(() => {
    Promise.all([
      fetch('/api/tenancies').then((r) => r.json()),
      fetch('/api/notices').then((r) => r.json()),
    ]).then(([t, n]) => {
      setTenancies(t);
      setNotices(n);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function calculateEffectiveDate(served: string, type: string): string {
    if (!served) return '-';
    const date = new Date(served);
    switch (type) {
      case 'section13': case 'rent_increase':
        date.setMonth(date.getMonth() + 2);
        break;
      case 'section8':
        date.setDate(date.getDate() + 14); // minimum for mandatory grounds
        break;
      case 'intention_to_sell': case 'family_move_in':
        date.setMonth(date.getMonth() + 4);
        break;
    }
    return date.toLocaleDateString('en-GB');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create notice');
        setSubmitting(false);
        return;
      }
      const notice = await res.json();
      setNotices((prev) => [notice, ...prev]);
      setShowForm(false);
      setForm({ tenancyId: '', type: 'section8', servedDate: '', grounds: '', notes: '', status: 'draft' });
    } catch {
      setError('Something went wrong');
    }
    setSubmitting(false);
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none';

  if (loading) return <div className="flex items-center justify-center py-16"><div className="text-slate-500">Loading...</div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Notice Generator</h1>
          <p className="text-slate-500 dark:text-slate-400">Create and track legal notices — Renters&apos; Rights Act compliant</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Create Notice
        </button>
      </div>

      {/* Notice effective date calculator */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">📅 Notice Period Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notice type</label>
            <select value={calcType} onChange={(e) => setCalcType(e.target.value)} className={inputClass}>
              {noticeTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date served</label>
            <input type="date" value={calcServedDate} onChange={(e) => setCalcServedDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Earliest effective date</label>
            <div className="px-4 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-bold">
              {calculateEffectiveDate(calcServedDate, calcType)}
            </div>
          </div>
        </div>
      </div>

      {/* Section 8 Grounds Reference */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">⚖️ Section 8 Grounds (Renters&apos; Rights Act Compliant)</h2>
        <div className="space-y-3">
          {section8Grounds.map((g) => (
            <div key={g.ground} className={`p-4 rounded-lg border-l-4 ${g.mandatory ? 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-navy dark:text-white">{g.ground}: {g.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${g.mandatory ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {g.mandatory ? 'Mandatory' : 'Discretionary'}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{g.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create Notice Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-amber p-6 mb-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Create Notice</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 text-sm">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tenancy *</label>
                <select value={form.tenancyId} onChange={(e) => setForm({ ...form, tenancyId: e.target.value })} required className={inputClass}>
                  <option value="">Select tenancy</option>
                  {tenancies.map((t) => <option key={t.id} value={t.id}>{t.property.address} — {t.tenant.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notice type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required className={inputClass}>
                  {noticeTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date served</label>
                <input type="date" value={form.servedDate} onChange={(e) => setForm({ ...form, servedDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="served">Served</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grounds / Details</label>
                <textarea value={form.grounds} onChange={(e) => setForm({ ...form, grounds: e.target.value })} rows={3} className={inputClass} placeholder="Specify the grounds for this notice..." />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-lg bg-amber text-navy-dark font-bold hover:bg-amber-light disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create Notice'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Notice History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Notice History</h2>
        {notices.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl">📝</span>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No notices created yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <div key={notice.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy dark:text-white">
                      {noticeTypes.find((t) => t.value === notice.type)?.label || notice.type}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {notice.tenancy.property.address} — {notice.tenancy.tenant.name}
                    </p>
                    {notice.servedDate && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Served: {new Date(notice.servedDate).toLocaleDateString('en-GB')}
                        {notice.effectiveDate && ` → Effective: ${new Date(notice.effectiveDate).toLocaleDateString('en-GB')}`}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${noticeStatusColors[notice.status] || noticeStatusColors.draft}`}>
                    {notice.status}
                  </span>
                </div>
                {notice.grounds && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 p-2 bg-white dark:bg-slate-800 rounded">{notice.grounds}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
