'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Document {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  uploadedAt: string;
  notes: string | null;
  property: { address: string; postcode: string } | null;
  tenancy: { tenant: { name: string } } | null;
}

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/documents/${id}`).then(r => r.json()).then(d => { setDoc(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this document?')) return;
    await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    router.push('/dashboard/documents');
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber border-t-transparent rounded-full" /></div>;
  if (!doc) return <div className="text-center py-20"><h2 className="text-xl font-semibold text-navy dark:text-white">Document not found</h2></div>;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/documents" className="hover:text-navy dark:hover:text-white">Documents</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">{doc.name}</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy dark:text-white">{doc.name}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={handleDelete} className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Type</label>
              <p className="mt-1 text-navy dark:text-white capitalize">{doc.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Property</label>
              <p className="mt-1 text-navy dark:text-white">{doc.property?.address || 'Not assigned'}</p>
            </div>
            {doc.tenancy && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Tenant</label>
                <p className="mt-1 text-navy dark:text-white">{doc.tenancy.tenant.name}</p>
              </div>
            )}
            {doc.notes && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Notes</label>
                <p className="mt-1 text-navy dark:text-white">{doc.notes}</p>
              </div>
            )}
          </div>
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-5xl mb-4">📄</span>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Document Preview</p>
            <a href={doc.fileUrl} className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
              Download File
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
