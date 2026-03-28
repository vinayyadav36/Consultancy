import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, BarChart, BarChart2, FileText, Globe, Megaphone, TrendingUp, Users, Zap, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrochureCard from '../components/BrochureCard';

const TridentHero = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="trident-glow mx-auto mb-6">
    <path d="M60 110V52" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round"/>
    <path d="M40 52V28C40 28 33 20 33 12C33 4 40 4 40 12C40 20 48 28 60 28C72 28 80 20 80 12C80 4 87 4 87 12C87 20 80 28 80 52" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 110H92" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="60" cy="52" r="7" fill="#22d3ee" opacity="0.8"/>
    <circle cx="60" cy="52" r="12" stroke="#22d3ee" strokeWidth="1" opacity="0.3"/>
    <circle cx="60" cy="52" r="20" stroke="#22d3ee" strokeWidth="0.5" opacity="0.15"/>
  </svg>
);

const WaveSection = () => (
  <div className="relative h-16 overflow-hidden" aria-hidden="true">
    <div className="wave-animation absolute whitespace-nowrap" style={{ bottom: 0 }}>
      <svg viewBox="0 0 1440 60" className="inline-block w-[200%]" preserveAspectRatio="none" style={{ height: 60 }}>
        <path d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,30 L1440,60 L0,60 Z" fill="rgba(34,211,238,0.15)" />
        <path d="M0,40 C200,10 400,60 600,40 C800,10 1000,60 1200,40 C1350,20 1440,50 1440,40 L1440,60 L0,60 Z" fill="rgba(49,46,129,0.2)" />
      </svg>
      <svg viewBox="0 0 1440 60" className="inline-block w-[200%]" preserveAspectRatio="none" style={{ height: 60 }}>
        <path d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,30 L1440,60 L0,60 Z" fill="rgba(34,211,238,0.15)" />
        <path d="M0,40 C200,10 400,60 600,40 C800,10 1000,60 1200,40 C1350,20 1440,50 1440,40 L1440,60 L0,60 Z" fill="rgba(49,46,129,0.2)" />
      </svg>
    </div>
  </div>
);

const Home = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${5 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      const size = `${2 + Math.random() * 4}px`;
      p.style.width = size;
      p.style.height = size;
      container.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach((p) => p.remove());
  }, []);

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const stats = [
    { value: '500+', label: 'Clients Served', icon: <Users className="h-6 w-6" /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <Star className="h-6 w-6" /> },
    { value: '₹10Cr+', label: 'Revenue Generated', icon: <TrendingUp className="h-6 w-6" /> },
    { value: '6+', label: 'Years Experience', icon: <Shield className="h-6 w-6" /> },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center sacred-bg overflow-hidden">
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)' }} />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(49,46,129,0.15) 0%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none" aria-hidden="true">
          <span className="text-[20rem] text-cyan-400">ॐ</span>
        </div>

        <div className="container relative z-10 py-20">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <TridentHero />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-sm font-medium tracking-[0.3em] uppercase text-cyan-400 mb-4">
              ॐ नमः शिवाय &nbsp;·&nbsp; Divine Digital Marketing
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Unleash the</span>{' '}
              <span className="text-cyan-400 glow-text">Cosmic Power</span>
              <br />
              <span className="text-white">of Your Brand</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Like the sacred Ganga that flows from Shiva's locks, we channel transformative digital energy
              to elevate your business to divine heights.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout" className="btn btn-primary inline-flex items-center justify-center gap-2">
                Begin Your Journey <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/services" className="btn btn-secondary inline-flex items-center justify-center gap-2">
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <WaveSection />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ background: 'rgba(30,27,75,0.3)', borderTop: '1px solid rgba(34,211,238,0.1)', borderBottom: '1px solid rgba(34,211,238,0.1)' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 text-cyan-400"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-cyan-400 glow-text">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" ref={ref}>
        <div className="container">
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn}
            transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="trident-divider"><span className="text-2xl text-cyan-400 opacity-50">᛭</span></div>
            <h2 className="text-4xl font-bold mb-4">Why Choose <span className="text-cyan-400">Shree Nandi</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Guided by the wisdom of Lord Shiva, we combine cosmic strategy with data-driven results
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Globe className="h-8 w-8 text-cyan-400" />, title: 'Global Reach', description: 'Connect with audiences worldwide through divinely-crafted campaigns' },
              { icon: <BarChart className="h-8 w-8 text-cyan-400" />, title: 'Data-Driven', description: 'Make enlightened decisions based on real-time cosmic analytics' },
              { icon: <Users className="h-8 w-8 text-cyan-400" />, title: 'Expert Team', description: 'Work with seasoned professionals blessed with marketing wisdom' },
              { icon: <Zap className="h-8 w-8 text-cyan-400" />, title: 'Swift Results', description: "Experience transformative growth as swift as Shiva's lightning" },
            ].map((feature, index) => (
              <motion.div key={index} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn}
                transition={{ duration: 0.6, delay: index * 0.1 }} className="service-card text-center group">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brochure Cards */}
      <section className="py-20" style={{ background: 'rgba(10,10,20,0.8)' }}>
        <div className="container">
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn}
            transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="trident-divider"><span className="text-2xl text-cyan-400 opacity-50">᛭</span></div>
            <h2 className="text-4xl font-bold mb-4">Sacred Marketing Plans</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Each plan is a divine gift — crafted to transform your business with the power of Shiva's blessings.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 'digital-growth', title: 'Digital Growth Plan', description: 'Accelerate your online presence with SEO, paid search, and conversion optimisation.', icon: <TrendingUp className="h-7 w-7 text-cyan-400" />, highlight: 'Most Popular' },
              { id: 'brand-identity', title: 'Brand Identity Plan', description: 'Build a memorable brand with a complete visual and messaging framework.', icon: <FileText className="h-7 w-7 text-cyan-400" />, highlight: 'Foundation' },
              { id: 'social-media', title: 'Social Media Plan', description: 'Grow your following and engage your community across every major platform.', icon: <Megaphone className="h-7 w-7 text-cyan-400" />, highlight: 'High Engagement' },
              { id: 'analytics-pro', title: 'Analytics Pro Plan', description: 'Turn raw data into actionable insights with custom dashboards and reporting.', icon: <BarChart2 className="h-7 w-7 text-cyan-400" />, highlight: 'Data-Driven' },
            ].map((card) => (
              <BrochureCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
            <div className="trident-divider"><span className="text-2xl text-cyan-400 opacity-50">᛭</span></div>
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Sharma', role: 'CEO, TechVentures India', text: 'Shree Nandi transformed our digital presence. Our revenue grew 3× in just 6 months. Truly divine results!', stars: 5 },
              { name: 'Priya Mehta', role: 'Founder, AyurVeda Plus', text: "The team's expertise in brand strategy helped us capture the wellness market. Outstanding work.", stars: 5 },
              { name: 'Amit Patel', role: 'MD, GreenTech Solutions', text: "From zero online presence to dominating search results. Shree Nandi's marketing is nothing short of miraculous.", stars: 5 },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="shiva-card">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-cyan-400">{t.name}</div>
                  <div className="text-gray-500 text-sm">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0a0a14 100%)' }}>
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.6 }}>
            <div className="text-4xl mb-4 text-cyan-400 opacity-30 select-none">ॐ</div>
            <h2 className="text-4xl font-bold mb-6">
              Ready to <span className="text-cyan-400 glow-text">Ascend</span> Your Business?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Let the cosmic power of divine marketing strategies guide your business to unprecedented heights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout" className="btn btn-primary inline-flex items-center justify-center gap-2">
                Start Your Journey <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/contact" className="btn btn-secondary inline-flex items-center justify-center gap-2">
                Schedule Consultation
              </Link>
            </div>
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              {['🔒 SSL Secured', '🏆 Award Winning', '⭐ 98% Satisfaction', '📞 24/7 Support', '🇮🇳 Made in India'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">{item}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-14">
            <div className="trident-divider"><span className="text-2xl text-cyan-400 opacity-50">᛭</span></div>
            <h2 className="text-4xl font-bold mb-4">How We <span className="text-cyan-400">Work</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our sacred 4-step process transforms your vision into measurable digital success.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { step: '01', title: 'Discovery', desc: 'Deep dive into your business, goals, and competitive landscape to craft your divine strategy.', icon: '🔍' },
              { step: '02', title: 'Strategy', desc: 'We craft a data-driven cosmic marketing blueprint aligned with your business destiny.', icon: '📋' },
              { step: '03', title: 'Execution', desc: 'Our expert team launches campaigns with precision, creativity, and relentless focus.', icon: '🚀' },
              { step: '04', title: 'Optimise', desc: 'Continuous measurement, learning, and refinement to maximise your ROI every month.', icon: '📈' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="service-card text-center relative"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-5xl font-bold text-cyan-400/20 absolute top-4 right-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2 text-cyan-400">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
