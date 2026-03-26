import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Coffee, Target, Shield, Zap, Star, Heart } from 'lucide-react';

const TridentDivider = () => (
  <div className="trident-divider my-8">
    <span className="text-2xl text-cyan-400 opacity-50">᛭</span>
  </div>
);

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [teamRef, teamInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '500+', label: 'Clients Served' },
    { icon: <Award className="h-6 w-6" />, value: '50+', label: 'Awards Won' },
    { icon: <Coffee className="h-6 w-6" />, value: '1000+', label: 'Projects Completed' },
    { icon: <Target className="h-6 w-6" />, value: '98%', label: 'Client Satisfaction' },
  ];

  const values = [
    { icon: <Shield className="h-7 w-7 text-cyan-400" />, title: 'Sacred Integrity', description: 'Like the eternal Shiva, we uphold unwavering honesty and transparency in every client relationship.' },
    { icon: <Zap className="h-7 w-7 text-cyan-400" />, title: 'Divine Innovation', description: 'Channelling cosmic creative energy, we craft cutting-edge digital strategies that transcend the ordinary.' },
    { icon: <Star className="h-7 w-7 text-cyan-400" />, title: 'Cosmic Excellence', description: 'Every campaign we deliver is blessed with the highest standard of craft, data, and measurable impact.' },
    { icon: <Heart className="h-7 w-7 text-cyan-400" />, title: 'Client Devotion', description: 'Your success is our puja. We treat every business goal with the devotion of a sacred offering.' },
  ];

  const team = [
    {
      name: 'Vinay Yadav',
      role: 'Founder & CEO',
      bio: 'Visionary entrepreneur with 6+ years in digital marketing. Leads the sacred mission of transforming Indian businesses.',
      avatar: '🧘',
    },
    {
      name: 'Priya Sharma',
      role: 'Creative Director',
      bio: 'Brand storyteller and visual strategist. Crafts divine brand identities that resonate deeply with audiences.',
      avatar: '🎨',
    },
    {
      name: 'Arjun Mehta',
      role: 'Head of Digital Strategy',
      bio: 'Data-driven strategist specialising in SEO, paid search, and performance analytics for maximum ROI.',
      avatar: '📊',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 sacred-bg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none" aria-hidden="true">
          <span className="text-[20rem] text-cyan-400">ॐ</span>
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="text-sm font-medium tracking-[0.3em] uppercase text-cyan-400 mb-4">
              ॐ नमः शिवाय &nbsp;·&nbsp; Our Sacred Story
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Guided by <span className="text-cyan-400 glow-text">Divine Wisdom</span>,<br />
              Driven by <span className="saffron-text">Results</span>
            </h1>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Shree Nandi Marketing Services was founded with a sacred purpose — to channel the
              transformative power of Lord Shiva into every digital campaign we craft. Like the
              Ganga that flows eternally from Shiva's locks, our strategies bring life and
              growth to every business we touch.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Based in Rewari, Haryana, our team of devoted digital experts combines ancient
              wisdom with modern marketing science to deliver results that are nothing short of miraculous.
            </p>
          </motion.div>
        </div>
      </section>

      <TridentDivider />

      {/* Stats Section */}
      <section className="py-16" style={{ background: 'rgba(30,27,75,0.3)', borderTop: '1px solid rgba(34,211,238,0.1)', borderBottom: '1px solid rgba(34,211,238,0.1)' }} ref={ref}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 text-cyan-400"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1 text-cyan-400 glow-text">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20" ref={valuesRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <TridentDivider />
            <h2 className="text-4xl font-bold mb-4">Our Sacred <span className="text-cyan-400">Values</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every action we take is rooted in the timeless principles that Lord Shiva embodies — destruction of ignorance and creation of opportunity.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="shiva-card text-center group"
              >
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-400">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20" style={{ background: 'rgba(10,10,20,0.8)' }} ref={teamRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <TridentDivider />
            <h2 className="text-4xl font-bold mb-4">Our <span className="gold-text">Sacred Team</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Meet the devoted experts who channel divine marketing energy for your business growth.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="shiva-card text-center group"
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'rgba(34,211,238,0.08)', border: '2px solid rgba(34,211,238,0.3)' }}>
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-cyan-400 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0a0a14 100%)' }}>
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-6 text-cyan-400 opacity-40 select-none">ॐ</div>
            <h2 className="text-3xl font-bold mb-6">
              Our <span className="text-cyan-400 glow-text">Sacred Mission</span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
              To be the divine bridge between traditional Indian businesses and the boundless
              opportunities of the digital world — guided by the cosmic principles of truth,
              transformation, and transcendence.
            </p>
            <div className="mt-8 text-gray-500 text-sm tracking-widest uppercase">
              ॐ नमः शिवाय &nbsp;·&nbsp; Shree Nandi Marketing Services
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;