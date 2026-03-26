import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const TridentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28V14" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M11 14V8C11 8 9 6 9 4C9 2 11 2 11 4C11 6 13 8 16 8C19 8 21 6 21 4C21 2 23 2 23 4C23 6 21 8 21 14" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 28H24" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="16" cy="14" r="2" fill="#22d3ee" opacity="0.7"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="text-white py-12 mt-16" style={{ background: 'linear-gradient(180deg, #0a0a14 0%, #1e1b4b 100%)', borderTop: '1px solid rgba(34,211,238,0.2)' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 group">
              <TridentIcon />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-cyan-400">Shree Nandi</span>
                <span className="text-xs text-gray-400 tracking-widest uppercase">Marketing Services</span>
              </div>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Transforming businesses through divine digital strategies — blessed by the cosmic power of Lord Shiva.
            </p>
            <div className="mt-4 flex gap-3">
              {['𝕏', 'in', 'f'].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/10 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/services', label: 'Services' },
                { to: '/certifications', label: 'Certifications' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="nav-link text-sm text-gray-300 hover:text-cyan-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {['Digital Marketing', 'Web Development', 'Brand Strategy', 'Content Creation', 'SEO Optimization'].map((s) => (
                <li key={s} className="hover:text-cyan-400 transition-colors cursor-pointer">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2 text-gray-300 text-sm">
                <Mail className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <a href="mailto:contact@shreenadimarketing.com" className="hover:text-cyan-400 transition-colors">
                  contact@shreenadimarketing.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-gray-300 text-sm">
                <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <a href="tel:+919992021159" className="hover:text-cyan-400 transition-colors">
                  +91 9992021159
                </a>
              </li>
              <li className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <span>Rewari, Haryana, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 text-center text-gray-500 text-sm" style={{ borderTop: '1px solid rgba(49,46,129,0.4)' }}>
          <p>ॐ नमः शिवाय &nbsp;|&nbsp; © {new Date().getFullYear()} Vinay Yadav · Shree Nandi Marketing Services · All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

