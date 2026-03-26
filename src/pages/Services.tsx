import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Globe,
  Code,
  PenTool,
  MessageSquare,
  BarChart,
  Search,
  Mail,
  Camera,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TridentDivider = () => (
  <div className="trident-divider my-8">
    <span className="text-2xl text-cyan-400 opacity-50">᛭</span>
  </div>
);

const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      icon: <Globe className="h-10 w-10 text-cyan-400" />,
      title: 'Digital Marketing',
      description:
        'Comprehensive divine digital marketing strategies to boost your online presence and reach your target audience effectively — blessed with cosmic precision.',
    },
    {
      icon: <Code className="h-10 w-10 text-cyan-400" />,
      title: 'Web Development',
      description:
        'Custom website development solutions that are responsive, fast, and conversion-optimised — crafted with the divine craftsmanship of Vishwakarma.',
    },
    {
      icon: <PenTool className="h-10 w-10 text-cyan-400" />,
      title: 'Brand Strategy',
      description:
        'Sacred brand development and positioning to help your identity radiate through the marketplace like Shiva\'s third eye illuminating the cosmos.',
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-cyan-400" />,
      title: 'Social Media',
      description:
        'Engaging social media management and content creation to build your brand community — growing your tribe with the fervour of divine devotion.',
    },
    {
      icon: <BarChart className="h-10 w-10 text-cyan-400" />,
      title: 'Analytics & Reports',
      description:
        'Data-driven insights and detailed reporting to track and elevate your marketing ROI — seeing the full truth like Shiva\'s all-seeing eye.',
    },
    {
      icon: <Search className="h-10 w-10 text-cyan-400" />,
      title: 'SEO Optimization',
      description:
        'Search engine optimisation to improve your visibility and organic traffic — ascending the rankings as Shiva ascends Mount Kailash.',
    },
    {
      icon: <Mail className="h-10 w-10 text-cyan-400" />,
      title: 'Email Marketing',
      description:
        'Sacred email campaigns to nurture leads and maintain devotion — delivering your message like the divine messenger Narada.',
    },
    {
      icon: <Camera className="h-10 w-10 text-cyan-400" />,
      title: 'Content Creation',
      description:
        'High-quality content creation including videos, graphics, and written content — manifesting your brand story with divine creative power.',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 sacred-bg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none" aria-hidden="true">
          <span className="text-[20rem] text-cyan-400">ॐ</span>
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="text-sm font-medium tracking-[0.3em] uppercase text-cyan-400 mb-4">
              ॐ नमः शिवाय &nbsp;·&nbsp; Sacred Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Divine <span className="text-cyan-400 glow-text">Marketing</span>{' '}
              <span className="saffron-text">Services</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              We offer a comprehensive suite of sacred digital marketing services — each one
              blessed with cosmic strategy and powered by data-driven wisdom — to help your
              business ascend to unprecedented heights.
            </p>
          </motion.div>
        </div>
      </section>

      <TridentDivider />

      {/* Services Grid */}
      <section className="py-20" ref={ref}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="service-card group"
              >
                <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-full group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TridentDivider />

      {/* CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0a0a14 100%)' }}>
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-4xl mb-4 text-cyan-400 opacity-30 select-none">ॐ</div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to Begin Your <span className="text-cyan-400 glow-text">Sacred Journey</span>?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Choose the divine marketing plan that aligns with your business destiny and let us guide you to cosmic growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout" className="btn btn-primary inline-flex items-center justify-center gap-2">
                View Sacred Plans <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/contact" className="btn btn-secondary inline-flex items-center justify-center gap-2">
                Speak to an Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;