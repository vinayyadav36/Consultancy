import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, BarChart2, Megaphone, TrendingUp } from 'lucide-react';

const brochures: Record<string, {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  sections: { heading: string; content: string }[];
}> = {
  'digital-growth': {
    title: 'Digital Growth Plan',
    subtitle: 'Accelerate your online presence with a tailored digital marketing roadmap.',
    icon: <TrendingUp className="h-10 w-10 text-emerald-400" />,
    sections: [
      {
        heading: 'Overview',
        content:
          'Our Digital Growth Plan is designed to help businesses of all sizes increase their online visibility, attract qualified traffic, and convert visitors into loyal customers.',
      },
      {
        heading: "What's Included",
        content:
          'SEO audit & strategy, paid search campaigns, conversion rate optimisation, monthly performance reports, and a dedicated account manager.',
      },
      {
        heading: 'Expected Results',
        content:
          'Clients typically see a 3× increase in organic traffic within 6 months and a 40% improvement in lead-to-customer conversion rates.',
      },
    ],
  },
  'brand-identity': {
    title: 'Brand Identity Plan',
    subtitle: 'Build a memorable brand that resonates with your target audience.',
    icon: <FileText className="h-10 w-10 text-emerald-400" />,
    sections: [
      {
        heading: 'Overview',
        content:
          'A strong brand identity goes beyond a logo. Our Brand Identity Plan delivers a comprehensive visual and messaging framework that sets you apart from competitors.',
      },
      {
        heading: "What's Included",
        content:
          'Logo design, colour palette & typography, brand voice guidelines, social media kit, business stationery templates, and a brand book.',
      },
      {
        heading: 'Expected Results',
        content:
          'Consistent branding across all touchpoints increases brand recall by up to 80% and builds trust with potential customers.',
      },
    ],
  },
  'social-media': {
    title: 'Social Media Marketing Plan',
    subtitle: 'Engage your community and grow your following on every platform.',
    icon: <Megaphone className="h-10 w-10 text-emerald-400" />,
    sections: [
      {
        heading: 'Overview',
        content:
          'Our Social Media Marketing Plan combines creative content creation with data-driven scheduling and community management to grow your brand presence.',
      },
      {
        heading: "What's Included",
        content:
          '30 posts per month, story & reel production, hashtag research, influencer outreach, weekly analytics review, and paid social ads.',
      },
      {
        heading: 'Expected Results',
        content:
          'Average 5× growth in followers within 3 months and measurable uplift in website referral traffic from social channels.',
      },
    ],
  },
  'analytics-pro': {
    title: 'Analytics Pro Plan',
    subtitle: 'Turn raw data into actionable insights that drive smarter decisions.',
    icon: <BarChart2 className="h-10 w-10 text-emerald-400" />,
    sections: [
      {
        heading: 'Overview',
        content:
          'Our Analytics Pro Plan gives you full visibility into your marketing performance with custom dashboards, funnel analysis, and predictive reporting.',
      },
      {
        heading: "What's Included",
        content:
          'GA4 & Tag Manager setup, custom KPI dashboards, monthly deep-dive reports, customer journey mapping, A/B testing framework, and quarterly strategy reviews.',
      },
      {
        heading: 'Expected Results',
        content:
          'Clients using data-driven decisions reduce wasted ad spend by 30% on average and improve overall campaign ROI by 50%.',
      },
    ],
  },
};

const TABS = [
  { id: 'brochure', label: 'Brochure' },
  { id: 'overview', label: 'Overview' },
];

const BusinessPlatform = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'brochure';
  const id = searchParams.get('id') ?? 'digital-growth';

  const brochure = brochures[id] ?? brochures['digital-growth'];

  const handleTabChange = (newTab: string) => {
    setSearchParams({ tab: newTab, id });
  };

  return (
    <div className="py-20">
      <div className="container">
        {/* Tabs */}
        <div className="flex gap-4 mb-10 border-b border-gray-800 pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                tab === t.id
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'brochure' && (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Brochure Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-400/10">
                {brochure.icon}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{brochure.title}</h1>
                <p className="text-gray-400 mt-1">{brochure.subtitle}</p>
              </div>
            </div>

            {/* Brochure Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {brochure.sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="service-card"
                >
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">
                    {section.heading}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Select another plan */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Explore Other Plans</h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(brochures).map(([planId, plan]) => (
                  <button
                    key={planId}
                    onClick={() => setSearchParams({ tab: 'brochure', id: planId })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      planId === id
                        ? 'bg-emerald-400 text-white'
                        : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {plan.title}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Business Platform</h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              The Business Platform brings together all our marketing plans and tools in one
              place. Browse our brochures, request a custom quote, and track campaign
              performance — all from a single dashboard.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BusinessPlatform;
