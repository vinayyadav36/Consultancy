import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TridentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="trident-glow">
    <path d="M16 28V14" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M11 14V8C11 8 9 6 9 4C9 2 11 2 11 4C11 6 13 8 16 8C19 8 21 6 21 4C21 2 23 2 23 4C23 6 21 8 21 14" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 28H24" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="16" cy="14" r="2" fill="#22d3ee" opacity="0.7"/>
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 py-4"
      style={{
        background: 'linear-gradient(90deg, #0a0a14 0%, #1e1b4b 50%, #0a0a14 100%)',
        borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <TridentIcon />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-cyan-400 glow-text">Shree Nandi</span>
            <span className="text-xs text-gray-400 tracking-widest uppercase">Marketing Services</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link text-sm font-medium tracking-wide ${
                location.pathname === link.path
                  ? 'text-cyan-400 glow-text'
                  : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/checkout"
            className="btn btn-primary text-sm px-5 py-2"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-cyan-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 py-4"
            style={{
              background: 'rgba(10, 10, 20, 0.98)',
              borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="container flex flex-col space-y-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link text-sm font-medium ${
                    location.pathname === link.path ? 'text-cyan-400' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/checkout"
                className="btn btn-primary text-sm text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
