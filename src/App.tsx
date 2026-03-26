import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import BusinessPlatform from './pages/BusinessPlatform';

const Certifications = lazy(() => import('./pages/Certifications'));
const Checkout = lazy(() => import('./pages/Checkout'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      <span className="text-cyan-400 text-sm tracking-widest uppercase">Loading...</span>
    </div>
  </div>
);

function App() {
  const isAdminEnabled = import.meta.env.VITE_ENABLE_ADMIN === 'true';

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/business-platform" element={<BusinessPlatform />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/admin"
                element={isAdminEnabled ? <Admin /> : <Navigate to="/" replace />}
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <AIChat />
      </div>
    </Router>
  );
}

export default App;
