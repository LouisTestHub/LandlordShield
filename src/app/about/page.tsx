import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'LandlordShield — built by landlords, for landlords. Our mission is to make compliance simple.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold">About LandlordShield</h1>
            <p className="mt-4 text-xl text-slate-300 max-w-2xl">
              Making landlord compliance simple, affordable, and stress-free.
            </p>
          </div>
        </section>

        <section className="py-20 bg-cream dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-navy dark:text-white">The Problem</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                UK private landlords are facing three major regulatory changes simultaneously: the Renters&apos; Rights Act 2025, mandatory Property Portal registration, and Making Tax Digital. Each brings new obligations, deadlines, and the risk of significant fines.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                Currently, landlords need 3-4 different tools to stay compliant — or they do it manually with spreadsheets and diary reminders. 93,000 landlords left the market in 2025 alone, partly because the complexity is overwhelming.
              </p>

              <h2 className="text-2xl font-bold text-navy dark:text-white mt-12">Our Solution</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                LandlordShield is a single platform that handles every compliance requirement in one place. From gas safety certificate reminders to Section 13 rent increase notices, from Property Portal document preparation to MTD-compliant record keeping — everything a landlord needs.
              </p>

              <h2 className="text-2xl font-bold text-navy dark:text-white mt-12">Who We&apos;re For</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                We built LandlordShield for the 2.8 million private landlords in England — especially the majority who manage 1-5 properties themselves. You shouldn&apos;t need to be a legal expert to be a compliant landlord.
              </p>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="text-3xl font-bold text-navy dark:text-amber">2.8M</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Private landlords in England</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="text-3xl font-bold text-navy dark:text-amber">3</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Major regulatory changes in 2026</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="text-3xl font-bold text-navy dark:text-amber">1</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Platform to handle them all</div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Link href="/register" className="inline-flex items-center px-8 py-3.5 rounded-lg bg-navy text-white font-bold text-lg hover:bg-navy-light transition-colors dark:bg-amber dark:text-navy-dark dark:hover:bg-amber-light">
                  Start Your Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
