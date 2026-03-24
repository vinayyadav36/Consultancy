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
} from 'lucide-react';

const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      icon: <Globe className="h-12 w-12 text-[--accent]" />,
      title: "Digital Marketing",
      description:
        "Comprehensive digital marketing strategies to boost your online presence and reach your target audience effectively.",
    },
    {
      icon: <Code className="h-12 w-12 text-[--accent]" />,
      title: "Web Development",
      description:
        "Custom website development solutions that are responsive, fast, and optimized for conversion.",
    },
    {
      icon: <PenTool className="h-12 w-12 text-[--accent]" />,
      title: "Brand Strategy",
      description:
        "Strategic brand development and positioning to help you stand out in your market.",
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-[--accent]" />,
      title: "Social Media",
      description:
        "Engaging social media management and content creation to build your brand community.",
    },
    {
      icon: <BarChart className="h-12 w-12 text-[--accent]" />,
      title: "Analytics & Reports",
      description:
        "Data-driven insights and detailed reporting to track and improve your marketing ROI.",
    },
    {
      icon: <Search className="h-12 w-12 text-[--accent]" />,
      title: "SEO Optimization",
      description:
        "Search engine optimization to improve your visibility and organic traffic.",
    },
    {
      icon: <Mail className="h-12 w-12 text-[--accent]" />,
      title: "Email Marketing",
      description:
        "Strategic email campaigns to nurture leads and maintain customer relationships.",
    },
    {
      icon: <Camera className="h-12 w-12 text-[--accent]" />,
      title: "Content Creation",
      description:
        "High-quality content creation including videos, graphics, and written content.",
    },
  ];

  return (
    <div className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We offer a comprehensive suite of digital marketing services to help your
            business grow and succeed in the digital landscape.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" ref={ref}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="service-card group"
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;