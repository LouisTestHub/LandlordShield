'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Insurance {
  id: string;
  provider: string;
  policyNumber: string | null;
  type: string;
  startDate: string;
  renewalDate: string;
  premium: number | null;
  excess: number | null;
  notes: string | null;
  property: { address: string; postcode: string };
}

const typeLabels: Record<string, string> = {
  buildings: 'Buildings', contents: 'Contents', landlord: 'Landlord',
  rent_guarantee: 'Rent Guarantee', legal: 'Legal Protection',
};

export default function InsuranceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [policy, setPolicy] = useState<Insurance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/insurance/${id}`).then(r => r.json()).then(d => { setPolicy(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this policy?')) return;
    await fetch(`/api/insurance/${id}`, { method: 'DELETE' });
    router.push('/dashboard/insurance');
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber border-t-transparent rounded-full" /></div>;
  if (!policy) return <div className="text-center py-20"><h2 className="text-xl font-semibold text-navy dark:text-white">Policy not found</h2></div>;

  const daysToRenewal = Math.ceil((new Date(policy.renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/insurance" className="hover:text-navy dark:hover:text-white">Insurance</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">{policy.provider}</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy dark:text-white">{policy.provider}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{typeLabels[policy.type] || policy.type} Insurance — {policy.property.address}</p>
          </div>
          <button onClick={handleDelete} className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete</button>
        </div>

        {daysToRenewal <= 30 && daysToRenewal >= 0 && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">⚠️ This policy renews in {daysToRenewal} day{daysToRenewal !== 1 ? 's' : ''}. Review and renew to maintain coverage.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policy.policyNumber && (
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Policy Number</label>
              <p className="mt-1 text-navy dark:text-white font-mono">{policy.policyNumber}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Start Date</label>
            <p className="mt-1 text-navy dark:text-white">{new Date(policy.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Renewal Date</label>
            <p className={`mt-1 font-semibold ${daysToRenewal <= 30 ? 'text-red-600 dark:text-red-400' : daysToRenewal <= 90 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
              {new Date(policy.renewalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {policy.premium !== null && (
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Annual Premium</label>
              <p className="mt-1 text-2xl font-bold text-navy dark:text-white">£{policy.premium.toLocaleString()}</p>
            </div>
          )}
          {policy.excess !== null && (
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Excess</label>
              <p className="mt-1 text-navy dark:text-white">£{policy.excess.toLocaleString()}</p>
            </div>
          )}
          {policy.notes && (
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Notes</label>
              <p className="mt-1 text-navy dark:text-white">{policy.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
