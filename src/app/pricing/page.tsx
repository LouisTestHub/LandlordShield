import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for UK landlords. From £15/month for 1-3 properties.',
};

const plans = [
  {
    name: 'Starter',
    price: '15',
    period: '/mo',
    properties: '1-3 properties',
    description: 'Perfect for landlords with a small portfolio',
    features: [
      'Compliance calendar',
      'Certificate tracking & reminders',
      'Document storage (1GB)',
      'Email reminders',
      'Basic notice templates',
      'Property Portal checklist',
      'Tenant management',
      'Maintenance tracking',
    ],
  },
  {
    name: 'Professional',
    price: '25',
    period: '/mo',
    properties: '4-10 properties',
    popular: true,
    description: 'For growing portfolios needing full compliance',
    features: [
      'Everything in Starter',
      'Rent management dashboard',
      'Rent increase calculator',
      'Section 13 notice generator',
      'Arrears workflow & letter templates',
      'Deposit protection tracker',
      'Document storage (10GB)',
      'Priority email support',
    ],
  },
  {
    name: 'Portfolio',
    price: '40',
    period: '/mo',
    properties: '11+ properties',
    description: 'Full compliance suite for serious landlords',
    features: [
      'Everything in Professional',
      'MTD integration (HMRC)',
      'Property Portal sync',
      'Bulk operations',
      'Document storage (50GB)',
      'Accountant portal access',
      'Advanced reporting',
      'Phone support',
    ],
  },
  {
    name: 'Enterprise',
    price: '75',
    period: '/mo',
    properties: '25+ properties',
    description: 'For property management companies',
    features: [
      'Everything in Portfolio',
      'Unlimited document storage',
      'API access',
      'Custom branding',
      'Dedicated account manager',
      'SLA guarantee',
      'Multi-user management',
      'Custom integrations',
    ],
  },
];

const faqs = [
  { q: 'Is there a free trial?', a: 'Yes — 14 days free on all plans. No credit card required.' },
  { q: 'Can I change plan later?', a: 'Absolutely. Upgrade or downgrade at any time. Changes take effect immediately.' },
  { q: 'What counts as a property?', a: 'Each unique rental address counts as one property. HMOs with multiple tenancies count as one property.' },
  { q: 'Is my data secure?', a: 'All data is encrypted in transit and at rest. We use UK-based data centres and are fully GDPR compliant.' },
  { q: 'Do you offer annual billing?', a: 'Yes — save 20% with annual billing. Contact us for enterprise annual agreements.' },
  { q: 'Can my accountant access my data?', a: 'Portfolio and Enterprise plans include accountant portal access. Your accountant gets read-only access to financial data.' },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h1>
            <p className="mt-4 text-xl text-slate-300">Start free for 14 days. No credit card required.</p>
          </div>
        </section>

        <section className="py-20 bg-cream dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan) => (
                <div key={plan.name} className={`relative rounded-2xl p-8 bg-white dark:bg-slate-800 border-2 ${plan.popular ? 'border-amber shadow-xl scale-105' : 'border-slate-200 dark:border-slate-700'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber text-navy-dark text-xs font-bold rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-navy dark:text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-navy dark:text-white">£{plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-amber">{plan.properties}</p>
                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className={`mt-8 block text-center py-3 rounded-lg font-semibold transition-colors ${plan.popular ? 'bg-amber text-navy-dark hover:bg-amber-light' : 'bg-navy text-white hover:bg-navy-light'}`}>
                    Start Free Trial
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-navy dark:text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details key={faq.q} className="group bg-cream dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-navy dark:text-white">
                    {faq.q}
                    <svg className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
