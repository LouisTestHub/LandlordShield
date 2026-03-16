import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CalendarIcon, ShieldIcon, PropertyIcon, MoneyIcon, DocumentIcon, TenantIcon } from '@/components/icons/FeatureIcons';

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy-dark text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
          <circle cx="600" cy="100" r="200" fill="white" opacity="0.1"/>
          <circle cx="100" cy="500" r="150" fill="#d69e2e" opacity="0.1"/>
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber/20 text-amber text-sm font-medium mb-6">
            🛡️ Renters&apos; Rights Act Phase 1 — 1 May 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            Every Compliance Requirement.{' '}
            <span className="text-amber">One Platform.</span>{' '}
            Zero Fines.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl">
            The all-in-one compliance platform for UK private landlords. Renters&apos; Rights Act, Property Portal, Making Tax Digital — managed in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-amber text-navy-dark font-bold text-lg hover:bg-amber-light transition-colors">
              Start Free Trial
            </Link>
            <Link href="/features" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors">
              See All Features →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { number: '2.8M', label: 'Landlords affected by new legislation' },
    { number: '6 weeks', label: 'Until Renters\' Rights Act Phase 1' },
    { number: '£40,000', label: 'Maximum fine for illegal eviction' },
  ];

  return (
    <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-navy dark:text-amber">{stat.number}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <CalendarIcon />,
      title: 'Compliance Calendar',
      description: 'Track every certificate expiry, inspection date, and legal deadline. Auto-reminders at 30, 60, and 90 days. Never miss a renewal.',
    },
    {
      icon: <PropertyIcon />,
      title: 'Property Portal Ready',
      description: 'Pre-populate your Property Portal registration. Track which documents are uploaded, which are missing, and what needs attention.',
    },
    {
      icon: <MoneyIcon />,
      title: 'MTD Integration',
      description: 'Making Tax Digital compliant record-keeping. Track rental income, expenses, and generate quarterly submissions to HMRC.',
    },
    {
      icon: <MoneyIcon className="h-12 w-12" />,
      title: 'Rent Management',
      description: 'Track payments, manage arrears, calculate Section 13 rent increases. Renters\' Rights Act compliant notice generation.',
    },
    {
      icon: <DocumentIcon />,
      title: 'Document Storage',
      description: 'Secure storage for all compliance documents. Gas safety certificates, EICRs, EPCs, tenancy agreements — everything in one place.',
    },
    {
      icon: <TenantIcon />,
      title: 'Tenant Communication',
      description: 'Professional templates for every landlord scenario. Rent reminders, maintenance responses, notice generation, deposit protection.',
    },
  ];

  return (
    <section className="py-24 bg-cream dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white">
            Everything a Landlord Needs to Stay Compliant
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Three major regulatory changes are hitting UK landlords simultaneously. LandlordShield handles all of them.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    { name: 'Starter', price: '15', properties: '1-3 properties', features: ['Compliance calendar', 'Certificate tracking', 'Document storage (1GB)', 'Email reminders', 'Basic templates'] },
    { name: 'Professional', price: '25', properties: '4-10 properties', popular: true, features: ['Everything in Starter', 'Rent management', 'Rent increase calculator', 'Section 13 generator', 'Document storage (10GB)', 'Priority support'] },
    { name: 'Portfolio', price: '40', properties: '11+ properties', features: ['Everything in Professional', 'MTD integration', 'Property Portal sync', 'Bulk operations', 'Document storage (50GB)', 'Accountant portal access'] },
    { name: 'Enterprise', price: '75', properties: '25+ properties', features: ['Everything in Portfolio', 'Unlimited storage', 'API access', 'Custom branding', 'Dedicated account manager', 'SLA guarantee'] },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Start free for 14 days. No credit card required.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-2xl p-8 border-2 ${plan.popular ? 'border-amber bg-amber/5 dark:bg-amber/10' : 'border-slate-200 dark:border-slate-700'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber text-navy-dark text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold text-navy dark:text-white">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-navy dark:text-white">£{plan.price}</span>
                <span className="text-slate-600 dark:text-slate-400">/mo</span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{plan.properties}</p>
              <ul className="mt-6 space-y-3">
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
  );
}

function TrustSignals() {
  return (
    <section className="py-16 bg-navy dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {['Renters\' Rights Act Ready', 'Property Portal Compatible', 'HMRC MTD Approved', 'GDPR Compliant', 'UK Data Centres'].map((badge) => (
            <div key={badge} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-medium">
              <svg className="h-5 w-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-navy to-navy-dark text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Don&apos;t Wait Until It&apos;s Too Late</h2>
        <p className="mt-4 text-lg text-slate-300">
          The Renters&apos; Rights Act comes into force on 1 May 2026. Property Portal registration follows shortly after. Get compliant now — before the fines start.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-amber text-navy-dark font-bold text-lg hover:bg-amber-light transition-colors">
            Start Your Free Trial
          </Link>
          <Link href="/features" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors">
            Explore Features
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <PricingSection />
        <TrustSignals />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
