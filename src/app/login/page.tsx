'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { LandlordShieldLogo } from '@/components/icons/LandlordShieldLogo';

const demoAccounts = [
  { label: 'Sarah (Landlord)', email: 'sarah@landlordshield.demo', password: 'LandlordShield2026!', role: '6 properties' },
  { label: 'James (Manager)', email: 'james@landlordshield.demo', password: 'LandlordShield2026!', role: 'Property Manager' },
  { label: 'Accountant', email: 'accountant@landlordshield.demo', password: 'LandlordShield2026!', role: 'Read-only Finance' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  }

  async function handleDemoLogin(email: string, password: string) {
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Demo account not found. Please run the seed script first.');
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <LandlordShieldLogo className="h-10 w-auto mx-auto" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-navy dark:text-white">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Or{' '}
            <Link href="/register" className="text-amber hover:text-amber-dark font-medium">
              start your free trial
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or try a demo account</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm disabled:opacity-50"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">{account.label}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{account.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
