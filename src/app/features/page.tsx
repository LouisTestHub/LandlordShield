import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CalendarIcon, ShieldIcon, PropertyIcon, MoneyIcon, DocumentIcon, TenantIcon, DashboardIcon } from '@/components/icons/FeatureIcons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Complete compliance management for UK landlords. Certificate tracking, rent management, Renters\' Rights Act tools, and more.',
};

export default function FeaturesPage() {
  const featureGroups = [
    {
      title: 'Compliance & Certificates',
      description: 'Never miss a renewal or inspection deadline',
      icon: <ShieldIcon className="h-16 w-16" />,
      features: [
        'Gas Safety certificate tracking (annual)',
        'EICR management (5-year cycle)',
        'EPC tracking (10-year validity)',
        'Legionella risk assessment (biennial)',
        'Fire risk assessment (annual review)',
        'Smoke & CO alarm checks (annual)',
        'PAT testing tracker (annual)',
        'Auto-calculated expiry dates',
        'Configurable reminders (30/60/90 days)',
        'Property Portal readiness checker',
      ],
    },
    {
      title: 'Compliance Calendar',
      description: 'Visual overview of every deadline across your portfolio',
      icon: <CalendarIcon className="h-16 w-16" />,
      features: [
        'Month/week/list view toggle',
        'RAG colour coding (red/amber/green)',
        'Click to view or add certificates',
        'Compliance score per property',
        'Dashboard widget with upcoming renewals',
        'Export to external calendars',
      ],
    },
    {
      title: 'Rent Management',
      description: 'Track income, manage arrears, handle increases legally',
      icon: <MoneyIcon className="h-16 w-16" />,
      features: [
        'Payment tracker per tenancy',
        'Income dashboard with totals and arrears',
        'Section 13 rent increase generator',
        'Market rent comparison tools',
        'Tribunal preparation checklist',
        'Arrears workflow with letter templates',
        'Deposit protection tracker',
        'Prescribed information checklist',
      ],
    },
    {
      title: 'Property Management',
      description: 'Complete property and tenant management',
      icon: <PropertyIcon className="h-16 w-16" />,
      features: [
        'Property portfolio overview',
        'Compliance RAG status per property',
        'Tenant directory with search/filter',
        'Right to Rent tracking',
        'Tenancy management with all details',
        'Maintenance request tracking',
        'Insurance policy management',
        'Document storage per property',
      ],
    },
    {
      title: 'Renters\' Rights Act Tools',
      description: 'Stay compliant with the new legislation',
      icon: <DocumentIcon className="h-16 w-16" />,
      features: [
        'Section 8 notice generator (all grounds)',
        'Section 13 rent increase notices',
        'Notice served → effective date calculator',
        'Status tracking with timeline',
        'Ground-by-ground explanations',
        'Tribunal preparation support',
        'Compliant notice templates',
      ],
    },
    {
      title: 'Dashboard & Reporting',
      description: 'Everything at a glance',
      icon: <DashboardIcon className="h-16 w-16" />,
      features: [
        'Portfolio compliance overview',
        'Expired certificate alerts',
        'Upcoming renewals (30/60/90 days)',
        'Rent income summary',
        'Arrears tracking',
        'Maintenance requests',
        'Notification centre',
        'Audit log for all actions',
      ],
    },
  ];

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold">Every Feature You Need</h1>
            <p className="mt-4 text-xl text-slate-300 max-w-2xl">
              Built specifically for UK private landlords facing the Renters&apos; Rights Act 2025, Property Portal, and Making Tax Digital.
            </p>
          </div>
        </section>

        {featureGroups.map((group, idx) => (
          <section key={group.title} className={`py-20 ${idx % 2 === 0 ? 'bg-cream dark:bg-slate-900' : 'bg-white dark:bg-slate-800'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="md:w-1/3">
                  <div className="mb-4">{group.icon}</div>
                  <h2 className="text-2xl font-bold text-navy dark:text-white">{group.title}</h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">{group.description}</p>
                </div>
                <div className="md:w-2/3">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {group.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
