import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ExternalLink } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: number;
  description: string;
  url?: string;
  color: string;
  icon: string;
  x: number;
  y: number;
}

const CERTIFICATIONS: Certification[] = [
  { id: 'c1', title: 'Google Digital Marketing', issuer: 'Google', year: 2023, description: 'Comprehensive certification covering all aspects of digital marketing including SEO, SEM, display advertising, and analytics.', url: 'https://skillshop.google.com', color: '#4285F4', icon: '🎓', x: 15, y: 20 },
  { id: 'c2', title: 'Meta Social Media Marketing', issuer: 'Meta', year: 2023, description: 'Professional certification in social media strategy, content creation, and paid advertising across Meta platforms.', url: 'https://www.facebook.com/business/learn', color: '#1877F2', icon: '📱', x: 35, y: 35 },
  { id: 'c3', title: 'HubSpot Content Marketing', issuer: 'HubSpot', year: 2022, description: 'Expert-level certification in content strategy, storytelling, brand voice development, and content promotion.', url: 'https://academy.hubspot.com', color: '#FF7A59', icon: '✍️', x: 55, y: 25 },
  { id: 'c4', title: 'AWS Cloud Practitioner', issuer: 'Amazon', year: 2023, description: 'Foundation-level certification demonstrating cloud computing knowledge and AWS services proficiency.', url: 'https://aws.amazon.com/certification', color: '#FF9900', icon: '☁️', x: 75, y: 40 },
  { id: 'c5', title: 'Stripe Payments Expert', issuer: 'Stripe', year: 2024, description: 'Certified in Stripe payment integration, webhooks, subscription management, and fraud prevention.', url: 'https://stripe.com', color: '#635BFF', icon: '💳', x: 20, y: 60 },
  { id: 'c6', title: 'SEMrush SEO Toolkit', issuer: 'SEMrush', year: 2023, description: 'Advanced SEO certification covering keyword research, competitive analysis, and technical SEO auditing.', url: 'https://www.semrush.com/academy', color: '#FF642D', icon: '🔍', x: 45, y: 65 },
  { id: 'c7', title: 'Salesforce Marketing Cloud', issuer: 'Salesforce', year: 2022, description: 'Professional certification in marketing automation, email campaigns, and customer journey management.', url: 'https://trailhead.salesforce.com', color: '#00A1E0', icon: '⚡', x: 70, y: 70 },
  { id: 'c8', title: 'LinkedIn Marketing Solutions', issuer: 'LinkedIn', year: 2024, description: 'B2B marketing certification covering LinkedIn ads, lead generation, and professional content strategy.', url: 'https://business.linkedin.com', color: '#0A66C2', icon: '💼', x: 85, y: 20 },
];

// Build path connections between nodes
const CONNECTIONS = [
  ['c1', 'c2'], ['c2', 'c3'], ['c3', 'c4'], ['c2', 'c5'],
  ['c5', 'c6'], ['c6', 'c7'], ['c4', 'c8'], ['c3', 'c6'],
];

const Certifications = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<Certification | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set(['c1']));
  const animFrameRef = useRef<number>(0);
  const progressRef = useRef<Record<string, number>>({});

  // Animate path progress
  useEffect(() => {
    CERTIFICATIONS.forEach((c) => {
      progressRef.current[c.id] = unlocked.has(c.id) ? 1 : 0;
    });
  }, [unlocked]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      CONNECTIONS.forEach(([fromId, toId]) => {
        const from = CERTIFICATIONS.find((c) => c.id === fromId);
        const to = CERTIFICATIONS.find((c) => c.id === toId);
        if (!from || !to) return;

        const fx = (from.x / 100) * w;
        const fy = (from.y / 100) * h;
        const tx = (to.x / 100) * w;
        const ty = (to.y / 100) * h;

        const isActive = unlocked.has(fromId) && unlocked.has(toId);

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = isActive ? 'rgba(34,211,238,0.4)' : 'rgba(49,46,129,0.3)';
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.setLineDash(isActive ? [] : [5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated particles along active paths
        if (isActive) {
          const t = ((frame * 0.01) % 1);
          const px = fx + (tx - fx) * t;
          const py = fy + (ty - fy) * t;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34,211,238,0.8)';
          ctx.fill();
        }
      });

      // Draw nodes
      CERTIFICATIONS.forEach((cert) => {
        const x = (cert.x / 100) * w;
        const y = (cert.y / 100) * h;
        const isUnlocked = unlocked.has(cert.id);
        const isHovered = hovered === cert.id;
        const radius = isHovered ? 28 : 22;

        // Outer glow ring
        if (isUnlocked) {
          const pulse = Math.sin(frame * 0.05) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34,211,238,${0.1 * pulse})`;
          ctx.lineWidth = 8;
          ctx.stroke();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius);
        if (isUnlocked) {
          gradient.addColorStop(0, cert.color + 'cc');
          gradient.addColorStop(1, cert.color + '44');
        } else {
          gradient.addColorStop(0, 'rgba(49,46,129,0.5)');
          gradient.addColorStop(1, 'rgba(30,27,75,0.3)');
        }
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isUnlocked ? cert.color : 'rgba(49,46,129,0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Icon
        ctx.font = `${isHovered ? 18 : 14}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cert.icon, x, y);

        // Label
        ctx.font = `bold ${isHovered ? 12 : 10}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = isUnlocked ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)';
        const label = cert.issuer.length > 10 ? cert.issuer.slice(0, 10) + '…' : cert.issuer;
        ctx.fillText(label, x, y + radius + 6);
      });

      frame++;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [unlocked, hovered]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;

    for (const cert of CERTIFICATIONS) {
      const cx = (cert.x / 100) * w;
      const cy = (cert.y / 100) * h;
      const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
      if (dist < 30) {
        setSelected(cert);
        if (!unlocked.has(cert.id)) {
          setUnlocked((prev) => new Set([...prev, cert.id]));
        }
        return;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;

    let found: string | null = null;
    for (const cert of CERTIFICATIONS) {
      const cx = (cert.x / 100) * w;
      const cy = (cert.y / 100) * h;
      const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
      if (dist < 30) { found = cert.id; break; }
    }
    setHovered(found);
    canvas.style.cursor = found ? 'pointer' : 'default';
  };

  return (
    <div className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="trident-divider"><span className="text-2xl text-cyan-400 opacity-50">᛭</span></div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sacred <span className="text-cyan-400 glow-text">Certifications</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our divine path of knowledge. Click each node to reveal its sacred certification.
            Each milestone unlocks the next level of our expertise.
          </p>
        </motion.div>

        {/* Canvas Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden mb-8"
          style={{
            height: '500px',
            background: 'linear-gradient(135deg, #0a0a14 0%, #1e1b4b 50%, #0a0a14 100%)',
            border: '1px solid rgba(34,211,238,0.2)',
            boxShadow: '0 0 40px rgba(34,211,238,0.05)',
          }}
        >
          {/* Background Om */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-3" aria-hidden="true">
            <span className="text-[30rem] text-indigo-900">ॐ</span>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            aria-label="Certifications map - click nodes to explore"
          />

          <div className="absolute top-4 left-4 text-xs text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-1" />Unlocked
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-900 ml-3 mr-1" />Locked
          </div>
          <div className="absolute bottom-4 right-4 text-xs text-gray-500 italic">
            Click any node to explore
          </div>
        </motion.div>

        {/* Certification grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(cert)}
              className="shiva-card cursor-pointer text-center group"
            >
              <div className="text-3xl mb-2">{cert.icon}</div>
              <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {cert.issuer}
              </div>
              <div className="text-xs text-gray-500 mt-1">{cert.year}</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Award className="h-3 w-3 text-cyan-400" />
                <span className="text-xs text-cyan-400">Certified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-8 max-w-md w-full relative"
              style={{
                background: 'linear-gradient(135deg, #131328 0%, #1e1b4b 100%)',
                border: `1px solid ${selected.color}44`,
                boxShadow: `0 0 40px ${selected.color}22`,
              }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-5xl mb-4 text-center">{selected.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-1 text-center">{selected.title}</h2>
              <div className="text-center mb-4">
                <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: selected.color + '22', color: selected.color }}>
                  {selected.issuer} · {selected.year}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 text-center">
                {selected.description}
              </p>

              <div className="flex justify-center">
                {selected.url && (
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-flex items-center gap-2 text-sm"
                  >
                    View Certificate <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Certifications;
