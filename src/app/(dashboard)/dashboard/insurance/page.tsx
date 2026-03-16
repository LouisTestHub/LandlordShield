'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

const typeColors: Record<string, string> = {
  buildings: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  contents: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  landlord: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rent_guarantee: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  legal: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

function getRenewalStatus(renewalDate: string) {
  const now = new Date();
  const renewal = new Date(renewalDate);
  const diff = (renewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return { label: 'Expired', color: 'text-red-600 dark:text-red-400' };
  if (diff <= 30) return { label: 'Renewing within 30 days', color: 'text-red-600 dark:text-red-400' };
  if (diff <= 60) return { label: 'Renewing within 60 days', color: 'text-amber-600 dark:text-amber-400' };
  if (diff <= 90) return { label: 'Renewing within 90 days', color: 'text-amber-600 dark:text-amber-400' };
  return { label: 'Active', color: 'text-green-600 dark:text-green-400' };
}

export default function InsurancePage() {
  const [policies, setPolicies] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/insurance').then(r => r.json()).then(d => { setPolicies(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalPremium = policies.reduce((sum, p) => sum + (p.premium || 0), 0);
  const renewingSoon = policies.filter(p => {
    const diff = (new Date(p.renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 90;
  }).length;

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Insurance</h1>
          <p className="text-slate-500 dark:text-slate-400">{policies.length} polic{policies.length !== 1 ? 'ies' : 'y'} tracked</p>
        </div>
        <Link href="/dashboard/insurance/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Add Policy
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Annual Premium</p>
          <p className="text-3xl font-bold text-navy dark:text-white">£{totalPremium.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Active Policies</p>
          <p className="text-3xl font-bold text-green-600">{policies.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Renewing Soon (90d)</p>
          <p className={`text-3xl font-bold ${renewingSoon > 0 ? 'text-amber-600' : 'text-green-600'}`}>{renewingSoon}</p>
        </div>
      </div>

      {policies.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">🛡️</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No insurance policies</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Add your insurance policies to track renewals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map(policy => {
            const status = getRenewalStatus(policy.renewalDate);
            return (
              <Link key={policy.id} href={`/dashboard/insurance/${policy.id}`} className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-navy dark:text-white">{policy.provider}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{policy.property.address}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[policy.type] || typeColors.landlord}`}>{typeLabels[policy.type] || policy.type}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Premium</p>
                    <p className="font-semibold text-navy dark:text-white">{policy.premium ? `£${policy.premium.toLocaleString()}/yr` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Renewal</p>
                    <p className={`font-semibold ${status.color}`}>{new Date(policy.renewalDate).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
                <p className={`mt-3 text-xs font-medium ${status.color}`}>{status.label}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
