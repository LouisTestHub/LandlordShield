import Link from 'next/link';
import { LandlordShieldLogo } from '@/components/icons/LandlordShieldLogo';

export function Footer() {
  return (
    <footer className="bg-navy dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <LandlordShieldLogo className="h-8 w-auto brightness-200" />
            <p className="mt-4 text-sm text-slate-300">
              Every compliance requirement. One platform. Zero fines. Built for UK private landlords.
            </p>
            <div className="flex gap-4 mt-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700">
                Renters&apos; Rights Act Ready
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="text-sm text-slate-300 hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber mb-4">Compliance</h3>
            <ul className="space-y-3">
              <li><span className="text-sm text-slate-300">Renters&apos; Rights Act 2025</span></li>
              <li><span className="text-sm text-slate-300">Property Portal</span></li>
              <li><span className="text-sm text-slate-300">Making Tax Digital</span></li>
              <li><span className="text-sm text-slate-300">Gas Safety Certificates</span></li>
              <li><span className="text-sm text-slate-300">EICR Management</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><span className="text-sm text-slate-300">Privacy Policy</span></li>
              <li><span className="text-sm text-slate-300">Terms of Service</span></li>
              <li><span className="text-sm text-slate-300">Data Processing</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} LandlordShield. All rights reserved.</p>
            <p className="text-sm text-slate-400">A Data &amp; Digital product</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
