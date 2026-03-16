'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  reportedDate: string;
  completedDate: string | null;
  cost: number | null;
  contractor: string | null;
  notes: string | null;
  property: { address: string; postcode: string };
  tenancy: { tenant: { name: string } } | null;
}

const statusFlow = ['reported', 'acknowledged', 'in_progress', 'completed', 'closed'];
const statusLabels: Record<string, string> = { reported: 'Reported', acknowledged: 'Acknowledged', in_progress: 'In Progress', completed: 'Completed', closed: 'Closed' };
const priorityColors: Record<string, string> = {
  emergency: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function MaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [req, setReq] = useState<MaintenanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/maintenance/${id}`).then(r => r.json()).then(d => { setReq(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    const res = await fetch(`/api/maintenance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req, status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReq({ ...req!, ...updated });
    }
    setUpdating(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this request?')) return;
    await fetch(`/api/maintenance/${id}`, { method: 'DELETE' });
    router.push('/dashboard/maintenance');
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber border-t-transparent rounded-full" /></div>;
  if (!req) return <div className="text-center py-20"><h2 className="text-xl font-semibold text-navy dark:text-white">Request not found</h2></div>;

  const currentIdx = statusFlow.indexOf(req.status);

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/maintenance" className="hover:text-navy dark:hover:text-white">Maintenance</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">{req.title}</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-navy dark:text-white">{req.title}</h1>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[req.priority]}`}>{req.priority}</span>
            </div>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{req.property.address}</p>
          </div>
          <button onClick={handleDelete} className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete</button>
        </div>

        {/* Status workflow */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Status Workflow</h3>
          <div className="flex items-center gap-2">
            {statusFlow.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus(s)}
                  disabled={updating}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    i <= currentIdx
                      ? 'bg-navy text-white dark:bg-amber dark:text-navy-dark'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {statusLabels[s]}
                </button>
                {i < statusFlow.length - 1 && <span className="text-slate-300 dark:text-slate-600">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Reported Date</label>
              <p className="mt-1 text-navy dark:text-white">{new Date(req.reportedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            {req.completedDate && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed Date</label>
                <p className="mt-1 text-navy dark:text-white">{new Date(req.completedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            )}
            {req.tenancy && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Reported By</label>
                <p className="mt-1 text-navy dark:text-white">{req.tenancy.tenant.name}</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {req.contractor && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Contractor</label>
                <p className="mt-1 text-navy dark:text-white">{req.contractor}</p>
              </div>
            )}
            {req.cost !== null && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Cost</label>
                <p className="mt-1 text-2xl font-bold text-navy dark:text-white">£{req.cost.toLocaleString()}</p>
              </div>
            )}
            {req.description && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Description</label>
                <p className="mt-1 text-navy dark:text-white">{req.description}</p>
              </div>
            )}
            {req.notes && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Notes</label>
                <p className="mt-1 text-navy dark:text-white">{req.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
