import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, BarChart, BarChart2, FileText, Globe, Megaphone, TrendingUp, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrochureCard from '../components/BrochureCard';

const Home = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
            alt="Marketing Team"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Transform Your Digital Presence
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We help businesses grow through innovative digital marketing strategies
              and cutting-edge solutions.
            </p>
            <Link to="/contact" className="btn btn-primary inline-flex items-center">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" ref={ref}>
        <div className="container">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We combine creativity with data-driven strategies to deliver exceptional results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="h-8 w-8 text-[--accent]" />,
                title: "Global Reach",
                description: "Connect with audiences worldwide through targeted campaigns",
              },
              {
                icon: <BarChart className="h-8 w-8 text-[--accent]" />,
                title: "Data-Driven",
                description: "Make informed decisions based on real-time analytics",
              },
              {
                icon: <Users className="h-8 w-8 text-[--accent]" />,
                title: "Expert Team",
                description: "Work with experienced professionals in digital marketing",
              },
              {
                icon: <Zap className="h-8 w-8 text-[--accent]" />,
                title: "Fast Results",
                description: "See measurable improvements in your digital presence",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="service-card"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brochure Cards Section */}
      <section className="py-20 bg-[#111111]">
        <div className="container">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Marketing Plans</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our tailored marketing plans designed to help your business thrive.
              Click any card to view the full brochure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: 'digital-growth',
                title: 'Digital Growth Plan',
                description:
                  'Accelerate your online presence with SEO, paid search, and conversion optimisation.',
                icon: <TrendingUp className="h-7 w-7 text-emerald-400" />,
                highlight: 'Most Popular',
              },
              {
                id: 'brand-identity',
                title: 'Brand Identity Plan',
                description:
                  'Build a memorable brand with a complete visual and messaging framework.',
                icon: <FileText className="h-7 w-7 text-emerald-400" />,
                highlight: 'Foundation',
              },
              {
                id: 'social-media',
                title: 'Social Media Plan',
                description:
                  'Grow your following and engage your community across every major platform.',
                icon: <Megaphone className="h-7 w-7 text-emerald-400" />,
                highlight: 'High Engagement',
              },
              {
                id: 'analytics-pro',
                title: 'Analytics Pro Plan',
                description:
                  'Turn raw data into actionable insights with custom dashboards and reporting.',
                icon: <BarChart2 className="h-7 w-7 text-emerald-400" />,
                highlight: 'Data-Driven',
              },
            ].map((card) => (
              <BrochureCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Business?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve your business goals through
              effective digital marketing strategies.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Schedule a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;