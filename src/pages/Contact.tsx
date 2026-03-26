import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Rewari, Haryana, India
const LOCATION: [number, number] = [28.1970, 76.6167];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error' | 'unavailable'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase || !isSupabaseConfigured) {
      setStatus('unavailable');
      return;
    }

    setStatus('loading');

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([formData]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

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
              ॐ नमः शिवाय &nbsp;·&nbsp; Connect With Us
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Begin Your <span className="text-cyan-400 glow-text">Divine</span> Conversation
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Have a question or ready to transform your business? We'd love to hear from you.
              Our sacred team is ready to guide you on the path to digital transcendence.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="shiva-card">
                <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all duration-300"
                      style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(49,46,129,0.5)' }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(34,211,238,0.6)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(49,46,129,0.5)'}
                      placeholder="e.g. Rajesh Sharma"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all duration-300"
                      style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(49,46,129,0.5)' }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(34,211,238,0.6)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(49,46,129,0.5)'}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all duration-300 resize-none"
                      style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(49,46,129,0.5)' }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(34,211,238,0.6)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(49,46,129,0.5)'}
                      placeholder="Tell us about your business and marketing goals..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn btn-primary w-full disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Sacred Message'}
                  </button>
                  {status === 'success' && (
                    <p className="text-cyan-400 text-center">🙏 Message sent! We'll respond within 24 hours.</p>
                  )}
                  {status === 'error' && (
                    <p className="text-red-400 text-center">Unable to send message. Please try again.</p>
                  )}
                  {status === 'unavailable' && (
                    <div className="shiva-card text-center">
                      <p className="text-yellow-400 text-sm mb-2">Form submission coming soon.</p>
                      <p className="text-gray-400 text-sm">
                        Please email us directly at{' '}
                        <a href="mailto:contact@shreenadimarketing.com" className="text-cyan-400 hover:underline">
                          contact@shreenadimarketing.com
                        </a>
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Contact Info + Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-8"
            >
              <div className="shiva-card">
                <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Contact Information</h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}>
                      <Mail className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</div>
                      <a href="mailto:contact@shreenadimarketing.com" className="text-gray-200 hover:text-cyan-400 transition-colors">
                        contact@shreenadimarketing.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}>
                      <Phone className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Phone</div>
                      <a href="tel:+919992021159" className="text-gray-200 hover:text-cyan-400 transition-colors">
                        +91 9992021159
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}>
                      <MapPin className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Office</div>
                      <span className="text-gray-200">Rewari, Haryana, India</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}>
                      <Clock className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Hours</div>
                      <span className="text-gray-200">Mon – Sat, 9:00 AM – 7:00 PM IST</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden" style={{ height: '280px', border: '1px solid rgba(49,46,129,0.4)' }}>
                <MapContainer
                  center={LOCATION}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={LOCATION}>
                    <Popup>
                      Shree Nandi Marketing Services · Rewari, Haryana
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;