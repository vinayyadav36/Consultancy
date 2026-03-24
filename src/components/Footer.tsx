import { Link } from 'react-router-dom';
import { Rocket, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold">
                Shree Nandi Marketing Services
              </span>
            </Link>
            <p className="mt-4 text-gray-400">
              Transforming businesses through innovative digital solutions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="nav-link text-white hover:text-green-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="nav-link text-white hover:text-green-500"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="nav-link text-white hover:text-green-500"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="nav-link text-white hover:text-green-500"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="nav-link text-white hover:text-green-500">
                Digital Marketing
              </li>
              <li className="nav-link text-white hover:text-green-500">
                Web Development
              </li>
              <li className="nav-link text-white hover:text-green-500">
                Brand Strategy
              </li>
              <li className="nav-link text-white hover:text-green-500">
                Content Creation
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2 text-white hover:text-green-500">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span>contact@digigrowth.com</span>
              </li>
              <li className="flex items-center space-x-2 text-white hover:text-green-500">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span>+91 9992021159</span>
              </li>
              <li className="flex items-center space-x-2 text-white hover:text-green-500">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span>Rewari , Haryana</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Vinay Yadav. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
