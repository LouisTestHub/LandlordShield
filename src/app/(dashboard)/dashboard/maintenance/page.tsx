'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  property: { address: string; postcode: string };
  tenancy: { tenant: { name: string } } | null;
}

const priorityColors: Record<string, string> = {
  emergency: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const statusColors: Record<string, string> = {
  reported: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  acknowledged: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};

const statusLabels: Record<string, string> = {
  reported: 'Reported', acknowledged: 'Acknowledged', in_progress: 'In Progress', completed: 'Completed', closed: 'Closed',
};

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    fetch('/api/maintenance').then(r => r.json()).then(d => { setRequests(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = requests.filter(r => (!filterStatus || r.status === filterStatus) && (!filterPriority || r.priority === filterPriority));

  const stats = {
    open: requests.filter(r => ['reported', 'acknowledged', 'in_progress'].includes(r.status)).length,
    completed: requests.filter(r => r.status === 'completed' || r.status === 'closed').length,
    emergency: requests.filter(r => r.priority === 'emergency' && r.status !== 'completed' && r.status !== 'closed').length,
    totalCost: requests.reduce((sum, r) => sum + (r.cost || 0), 0),
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Maintenance</h1>
          <p className="text-slate-500 dark:text-slate-400">{requests.length} request{requests.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <Link href="/dashboard/maintenance/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Log Request
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Open</p>
          <p className="text-2xl font-bold text-navy dark:text-white">{stats.open}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Emergency</p>
          <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Cost</p>
          <p className="text-2xl font-bold text-navy dark:text-white">£{stats.totalCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
          <option value="">All Statuses</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
          <option value="">All Priorities</option>
          <option value="emergency">Emergency</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">🔧</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No maintenance requests</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Log a maintenance request to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => (
            <Link key={req.id} href={`/dashboard/maintenance/${req.id}`} className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-navy dark:text-white">{req.title}</h3>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[req.priority]}`}>{req.priority}</span>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[req.status]}`}>{statusLabels[req.status]}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{req.property.address}</p>
                  {req.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-1">{req.description}</p>}
                </div>
                <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                  <p>{new Date(req.reportedDate).toLocaleDateString('en-GB')}</p>
                  {req.cost && <p className="font-medium text-navy dark:text-white">£{req.cost.toLocaleString()}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
