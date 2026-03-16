'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'company', label: 'Company', icon: '🏢' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'defaults', label: 'Defaults', icon: '⚙️' },
    { id: 'subscription', label: 'Subscription', icon: '💳' },
    { id: 'data', label: 'Data Export', icon: '📦' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-navy dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">Settings</span>
      </div>

      <h1 className="text-2xl font-bold text-navy dark:text-white mb-8">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-56 shrink-0">
          <div className="space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-navy text-white dark:bg-amber dark:text-navy-dark' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-navy dark:text-white mb-6">Profile Settings</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input type="text" defaultValue="Sarah Johnson" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" defaultValue="sarah@landlordshield.demo" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input type="tel" defaultValue="07700 900123" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <input type="password" placeholder="Current password" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
                    <input type="password" placeholder="New password" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
                    <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
                  </div>
                </div>
                <button className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-navy dark:text-white mb-6">Company / Portfolio Details</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                  <input type="text" placeholder="Optional — for reports & documents" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Address</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UTR Number</label>
                  <input type="text" placeholder="For MTD submissions" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none" />
                </div>
                <button className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-navy dark:text-white mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Certificate expiry reminders', desc: 'Get notified before certificates expire' },
                  { label: 'Rent payment alerts', desc: 'Notified when rent is due, late, or missed' },
                  { label: 'Compliance task reminders', desc: 'Upcoming compliance tasks and deadlines' },
                  { label: 'Insurance renewal warnings', desc: 'Reminders before insurance policies renew' },
                  { label: 'Maintenance updates', desc: 'Status changes on maintenance requests' },
                  { label: 'MTD quarterly reminders', desc: 'Submission deadline reminders' },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">{n.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{n.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-amber dark:bg-slate-600 dark:peer-checked:bg-amber after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
                <div className="pt-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reminder Lead Time</label>
                  <select defaultValue="30" className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                    <option value="14">14 days before</option>
                    <option value="30">30 days before</option>
                    <option value="60">60 days before</option>
                    <option value="90">90 days before</option>
                  </select>
                </div>
                <button className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">Save Preferences</button>
              </div>
            </div>
          )}

          {activeTab === 'defaults' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-navy dark:text-white mb-6">Default Values</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Deposit Scheme</label>
                  <select defaultValue="DPS" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                    <option value="DPS">DPS (Deposit Protection Service)</option>
                    <option value="TDS">TDS (Tenancy Deposit Scheme)</option>
                    <option value="MyDeposits">MyDeposits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Payment Method</label>
                  <select defaultValue="bank_transfer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="standing_order">Standing Order</option>
                    <option value="direct_debit">Direct Debit</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Rent Frequency</label>
                  <select defaultValue="monthly" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber focus:border-transparent outline-none">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <button className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">Save Defaults</button>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-navy dark:text-white mb-6">Subscription</h2>
              <div className="bg-amber/10 border border-amber rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber font-semibold uppercase">Current Plan</p>
                    <h3 className="text-2xl font-bold text-navy dark:text-white">Professional</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">4-10 properties • £25/month</p>
                  </div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium dark:bg-green-900/30 dark:text-green-400">Active</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                  <h3 className="font-semibold text-navy dark:text-white">Portfolio</h3>
                  <p className="text-2xl font-bold text-navy dark:text-white mt-1">£40<span className="text-sm text-slate-500 dark:text-slate-400 font-normal">/mo</span></p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">11+ properties</p>
                  <button className="mt-4 w-full py-2 rounded-lg border border-amber text-amber font-semibold hover:bg-amber/10 transition-colors">Upgrade</button>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                  <h3 className="font-semibold text-navy dark:text-white">Enterprise</h3>
                  <p className="text-2xl font-bold text-navy dark:text-white mt-1">£75<span className="text-sm text-slate-500 dark:text-slate-400 font-normal">/mo</span></p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">25+ properties • API access</p>
                  <button className="mt-4 w-full py-2 rounded-lg border border-amber text-amber font-semibold hover:bg-amber/10 transition-colors">Upgrade</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-navy dark:text-white mb-6">Data Export</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Download all your data in CSV or JSON format. This includes properties, tenants, tenancies, certificates, payments, expenses, and documents.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">CSV Export</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Spreadsheet-compatible format</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">Download CSV</button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">JSON Export</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Machine-readable format</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark">Download JSON</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-red-200 dark:border-red-800 p-6">
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-6">⚠️ Danger Zone</h2>
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <button className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">Delete My Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
