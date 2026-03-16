'use client';

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors print:hidden">
      🖨️ Print
    </button>
  );
}
