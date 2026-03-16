'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Payment {
  id: string; amount: number; dueDate: string; paidDate: string | null; status: string; method: string | null;
  tenancy: { id: string; property: { address: string }; tenant: { name: string }; rentAmount: number };
}

const statusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  partial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  missed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  void: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};

export default function RentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/rent/payments').then((r) => r.json()).then((data) => {
      setPayments(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function updateStatus(paymentId: string, status: string) {
    setUpdating(paymentId);
    const paidDate = status === 'paid' ? new Date().toISOString() : null;
    try {
      const res = await fetch(`/api/rent/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paidDate }),
      });
      if (res.ok) {
        setPayments((prev) => prev.map((p) => p.id === paymentId ? { ...p, status, paidDate } : p));
      }
    } catch { /* ignore */ }
    setUpdating(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-slate-500 dark:text-slate-400">Loading payments...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Payment Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400">Record and manage rent payments per tenancy</p>
        </div>
        <Link href="/dashboard/rent" className="text-sm text-slate-500 hover:text-navy dark:text-slate-400 dark:hover:text-amber">← Rent Dashboard</Link>
      </div>

      {/* Arrears letter templates */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
        <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">📋 Arrears Letter Templates</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
            1st Reminder (Friendly)
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
            2nd Reminder (Formal)
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 text-sm text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            Formal Notice (Pre-action)
          </button>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">💳</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No payments recorded</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Payments will appear here once you create tenancies.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Property</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Tenant</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Due</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Paid</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{payment.tenancy.property.address}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{payment.tenancy.tenant.name}</td>
                  <td className="py-3 px-4 font-medium text-navy dark:text-white">£{payment.amount}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{new Date(payment.dueDate).toLocaleDateString('en-GB')}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('en-GB') : '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {payment.status !== 'paid' && (
                        <button onClick={() => updateStatus(payment.id, 'paid')} disabled={updating === payment.id}
                          className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 disabled:opacity-50">
                          ✓ Paid
                        </button>
                      )}
                      {payment.status !== 'partial' && payment.status !== 'paid' && (
                        <button onClick={() => updateStatus(payment.id, 'partial')} disabled={updating === payment.id}
                          className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 disabled:opacity-50">
                          Partial
                        </button>
                      )}
                      {payment.status !== 'missed' && payment.status !== 'paid' && (
                        <button onClick={() => updateStatus(payment.id, 'missed')} disabled={updating === payment.id}
                          className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 disabled:opacity-50">
                          Missed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
