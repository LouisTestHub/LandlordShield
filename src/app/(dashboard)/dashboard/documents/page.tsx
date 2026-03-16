'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

const typeLabels: Record<string, string> = {
  contract: 'Contract', certificate: 'Certificate', photo: 'Photo',
  report: 'Report', letter: 'Letter', receipt: 'Receipt', notice: 'Notice',
};

const typeColors: Record<string, string> = {
  contract: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  certificate: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  photo: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  report: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  letter: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  receipt: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  notice: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'certificate', propertyId: '', notes: '' });
  const [properties, setProperties] = useState<{ id: string; address: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/documents').then(r => r.json()),
      fetch('/api/properties').then(r => r.json()),
    ]).then(([docs, props]) => {
      setDocuments(Array.isArray(docs) ? docs : []);
      setProperties(Array.isArray(props) ? props : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, fileUrl: '/uploads/' + form.name.replace(/\s+/g, '-').toLowerCase() + '.pdf' }),
    });
    if (res.ok) {
      const doc = await res.json();
      const prop = properties.find(p => p.id === form.propertyId);
      setDocuments([{ ...doc, property: prop ? { address: prop.address, postcode: '' } : null, tenancy: null }, ...documents]);
      setShowUpload(false);
      setForm({ name: '', type: 'certificate', propertyId: '', notes: '' });
    }
  }

  const filtered = filterType ? documents.filter(d => d.type === filterType) : documents;

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Documents</h1>
          <p className="text-slate-500 dark:text-slate-400">{documents.length} document{documents.length !== 1 ? 's' : ''} in your library</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="inline-flex items-center px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">
          + Upload Document
        </button>
      </div>

      {showUpload && (
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-white mb-4">Upload Document</h2>
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Document Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property</label>
              <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                <option value="">All Properties</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
              <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
            </div>
            <div className="md:col-span-2">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <span className="text-3xl">📎</span>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Drag & drop files here, or click to browse</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">Upload</button>
              <button type="button" onClick={() => setShowUpload(false)} className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilterType('')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!filterType ? 'bg-navy text-white dark:bg-amber dark:text-navy-dark' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}>All</button>
        {Object.entries(typeLabels).map(([k, v]) => (
          <button key={k} onClick={() => setFilterType(k)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterType === k ? 'bg-navy text-white dark:bg-amber dark:text-navy-dark' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}>{v}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-5xl">📄</span>
          <h2 className="mt-4 text-xl font-semibold text-navy dark:text-white">No documents yet</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Upload your first document to get started.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase hidden md:table-cell">Property</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase hidden lg:table-cell">Uploaded</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/documents/${doc.id}`} className="font-medium text-navy dark:text-white hover:text-amber">{doc.name}</Link>
                  </td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[doc.type] || typeColors.letter}`}>{typeLabels[doc.type] || doc.type}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">{doc.property?.address || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden lg:table-cell">{new Date(doc.uploadedAt).toLocaleDateString('en-GB')}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/documents/${doc.id}`} className="text-sm text-amber hover:text-amber-dark font-medium">View</Link>
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
