import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy-dark text-white overflow-hidden py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber/20 text-amber text-sm font-medium mb-6">
            📊 Investment Opportunity
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            The{' '}<span className="text-amber">£524M</span>{' '}Compliance Platform Opportunity
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300">
            Three regulatory tsunamis are hitting 2.3 million UK landlords simultaneously. LandlordShield is the only platform that covers all three.
          </p>
        </div>
      </div>
    </section>
  );
}

function MarketSection() {
  const stats = [
    { value: '2.3M', label: 'Private landlords in England' },
    { value: '4.6M', label: 'Private rented dwellings' },
    { value: '£524M', label: 'Total addressable market' },
    { value: '£40K', label: 'Max fine for non-compliance' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-navy dark:text-white text-center mb-12">Market Size</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map(s => (
            <div key={s.label} className="text-center p-6 rounded-2xl bg-cream dark:bg-slate-700">
              <p className="text-4xl font-bold text-navy dark:text-amber">{s.value}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-600 dark:text-slate-300 text-center">
            The UK private rented sector generates over £60 billion in annual rental income. With three major regulatory changes landing in 2026-2027,
            every landlord needs a compliance platform. At an average revenue per user of £228/year, even 10% market penetration represents a £524M opportunity.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      icon: '🏛️',
      title: 'Renters\' Rights Act',
      date: '1 May 2026',
      description: 'Section 21 abolished. Periodic tenancies become default. New possession grounds. Landlords must prove compliance for every property.',
      impact: '£5,000 – £40,000 fines for illegal eviction',
    },
    {
      icon: '🏠',
      title: 'Property Portal',
      date: 'Late 2026',
      description: 'Mandatory registration of every rented property. All compliance documents must be uploaded and maintained. Failure to register = criminal offence.',
      impact: 'Criminal prosecution for non-registration',
    },
    {
      icon: '📊',
      title: 'Making Tax Digital',
      date: 'April 2026 (£50K+)',
      description: 'Digital record-keeping mandatory. Quarterly submissions to HMRC. Manual bookkeeping no longer accepted for property income above threshold.',
      impact: '£200+ penalties per missed quarterly submission',
    },
  ];

  return (
    <section className="py-20 bg-cream dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-navy dark:text-white text-center mb-4">The Problem</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">Three regulatory tsunamis hitting simultaneously — landlords have never faced this level of compliance complexity.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map(p => (
            <div key={p.title} className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <span className="text-4xl">{p.icon}</span>
              <h3 className="mt-4 text-xl font-bold text-navy dark:text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-amber font-semibold">{p.date}</p>
              <p className="mt-3 text-slate-600 dark:text-slate-400">{p.description}</p>
              <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">⚠️ {p.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-navy dark:text-white text-center mb-4">Why LandlordShield</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">The only platform covering all three regulatory requirements in one integrated solution.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Feature</th>
                <th className="text-center py-4 px-4 text-sm font-bold text-amber">LandlordShield</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Arthur Online</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Landlord Vision</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Hammock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                ['Compliance Calendar', true, true, false, false],
                ['Certificate Tracking', true, true, true, false],
                ['Renters\' Rights Act Ready', true, false, false, false],
                ['Property Portal Integration', true, false, false, false],
                ['MTD Tax Preparation', true, false, true, false],
                ['Rent Management', true, true, true, true],
                ['Maintenance Tracking', true, true, false, true],
                ['Document Storage', true, true, true, false],
                ['Insurance Tracking', true, false, false, false],
                ['Financial Reports', true, false, true, false],
                ['Deposit Protection', true, true, false, false],
                ['Starting Price (monthly)', '£15', '£49', '£12', '£20'],
              ].map(([feature, ...values]) => (
                <tr key={feature as string}>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{feature as string}</td>
                  {values.map((v, i) => (
                    <td key={i} className="py-3 px-4 text-center">
                      {typeof v === 'boolean' ? (
                        v ? <span className="text-green-500">✅</span> : <span className="text-slate-300 dark:text-slate-600">❌</span>
                      ) : (
                        <span className={`text-sm font-medium ${i === 0 ? 'text-amber font-bold' : 'text-slate-500 dark:text-slate-400'}`}>{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function RevenueSection() {
  const projections = [
    { scenario: 'Conservative', users: '5,000', arr: '£1.14M', marketShare: '0.2%', color: 'border-green-500' },
    { scenario: 'Moderate', users: '25,000', arr: '£5.7M', marketShare: '1.1%', color: 'border-amber' },
    { scenario: 'Aggressive', users: '100,000', arr: '£22.8M', marketShare: '4.3%', color: 'border-red-500' },
  ];

  return (
    <section className="py-20 bg-cream dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-navy dark:text-white text-center mb-12">Revenue Projections (Year 3)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projections.map(p => (
            <div key={p.scenario} className={`bg-white dark:bg-slate-800 rounded-2xl p-8 border-t-4 ${p.color} border border-slate-200 dark:border-slate-700`}>
              <h3 className="text-lg font-bold text-navy dark:text-white">{p.scenario}</h3>
              <p className="text-4xl font-bold text-navy dark:text-amber mt-4">{p.arr}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Annual Recurring Revenue</p>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Paying Users</span>
                  <span className="font-medium text-navy dark:text-white">{p.users}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Market Share</span>
                  <span className="font-medium text-navy dark:text-white">{p.marketShare}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">ARPU</span>
                  <span className="font-medium text-navy dark:text-white">£228/yr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GTMSection() {
  const strategies = [
    { icon: '🎯', title: 'Regulatory Urgency', desc: 'Launch timing aligns with Renters\' Rights Act (May 2026). Landlords are actively searching for compliance solutions.' },
    { icon: '🤝', title: 'Partnership Channel', desc: 'Letting agents, accountants, and solicitors as distribution partners. Volume licensing and white-label options.' },
    { icon: '📱', title: 'Content + SEO', desc: 'Authority content around RRA compliance, MTD deadlines, and Property Portal registration. Organic acquisition at scale.' },
    { icon: '🔄', title: 'Freemium Conversion', desc: '14-day free trial → professional tier. Free compliance checklist tool drives awareness. Low friction, high activation.' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-navy dark:text-white text-center mb-12">Go-to-Market Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {strategies.map(s => (
            <div key={s.title} className="flex gap-4 p-6 rounded-2xl bg-cream dark:bg-slate-700">
              <span className="text-3xl shrink-0">{s.icon}</span>
              <div>
                <h3 className="font-bold text-navy dark:text-white">{s.title}</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="py-20 bg-cream dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-navy dark:text-white text-center mb-12">Founding Team</h2>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 rounded-full bg-navy dark:bg-amber mx-auto flex items-center justify-center text-3xl">
              🛡️
            </div>
            <h3 className="mt-4 text-xl font-bold text-navy dark:text-white">LandlordShield</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Built by entrepreneurs who understand both the UK property market and the technology needed to serve it.
              Our team combines deep property management experience with modern SaaS development.
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              We&apos;re building the compliance infrastructure that 2.3 million landlords will need — and we&apos;re doing it before the deadlines hit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-navy to-navy-dark text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Join the Founding Members</h2>
        <p className="mt-4 text-lg text-slate-300">
          Be part of the platform that will define how UK landlords manage compliance. Early access, founding member pricing, and a seat at the table.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-amber text-navy-dark font-bold text-lg hover:bg-amber-light transition-colors">
            Join the Founding Members
          </Link>
          <Link href="/features" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors">
            See the Platform →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function OpportunityPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <MarketSection />
        <ProblemSection />
        <SolutionSection />
        <RevenueSection />
        <GTMSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
