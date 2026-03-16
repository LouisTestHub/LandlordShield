'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const certTypes = [
  { value: 'gas_safety', label: 'Gas Safety Certificate', validity: '12 months' },
  { value: 'eicr', label: 'EICR (Electrical Installation)', validity: '5 years' },
  { value: 'epc', label: 'Energy Performance Certificate', validity: '10 years' },
  { value: 'legionella', label: 'Legionella Risk Assessment', validity: '2 years' },
  { value: 'fire_risk', label: 'Fire Risk Assessment', validity: '1 year' },
  { value: 'smoke_co', label: 'Smoke & CO Alarm Check', validity: '1 year' },
  { value: 'pat', label: 'PAT Testing', validity: '1 year' },
  { value: 'asbestos', label: 'Asbestos Survey', validity: '1 year' },
];

export default function NewCertificatePageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-slate-500">Loading...</div></div>}>
      <NewCertificatePage />
    </Suspense>
  );
}

function NewCertificatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState<Array<{ id: string; address: string }>>([]);
  const [form, setForm] = useState({
    propertyId: searchParams.get('propertyId') || '',
    type: 'gas_safety',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    certificateNumber: '',
    engineer: '',
    engineerGasRegNo: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/properties').then((r) => r.json()).then(setProperties).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create certificate');
        setLoading(false);
        return;
      }

      const cert = await res.json();
      router.push(`/dashboard/certificates/${cert.id}`);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  const selectedCert = certTypes.find((c) => c.value === form.type);
  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">Add Certificate</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Record a compliance certificate for a property.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Certificate Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Property *</label>
              <select value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} required className={inputClass}>
                <option value="">Select property</option>
                {properties.map((p) => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Certificate type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required className={inputClass}>
                {certTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {selectedCert && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Standard validity: {selectedCert.validity}</p>}
            </div>
            <div>
              <label className={labelClass}>Certificate number</label>
              <input type="text" value={form.certificateNumber} onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })} className={inputClass} placeholder="Optional" />
            </div>
            <div>
              <label className={labelClass}>Issue date *</label>
              <input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Expiry date (auto-calculated if blank)</label>
              <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Engineer Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Engineer name</label>
              <input type="text" value={form.engineer} onChange={(e) => setForm({ ...form, engineer: e.target.value })} className={inputClass} placeholder="Name of qualified engineer" />
            </div>
            <div>
              <label className={labelClass}>Gas Safe Registration No.</label>
              <input type="text" value={form.engineerGasRegNo} onChange={(e) => setForm({ ...form, engineerGasRegNo: e.target.value })} className={inputClass} placeholder="For Gas Safety only" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Notes</h2>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={inputClass} placeholder="Any additional notes..." />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-amber text-navy-dark font-bold hover:bg-amber-light transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Certificate'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
