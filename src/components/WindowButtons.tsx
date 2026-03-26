import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';

interface WindowButtonsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  initialMinimized?: boolean;
  initialFullscreen?: boolean;
}

type WindowState = 'normal' | 'minimized' | 'fullscreen';

const DockIcon = ({ title, onClick }: { title: string; onClick: () => void }) => (
  <motion.div
    initial={{ scale: 0, y: 20 }}
    animate={{ scale: 1, y: 0 }}
    exit={{ scale: 0, y: 20 }}
    whileHover={{ scale: 1.1 }}
    onClick={onClick}
    className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer shadow-lg"
    style={{
      background: 'linear-gradient(135deg, #1e1b4b, #0a0a14)',
      border: '1px solid rgba(34,211,238,0.4)',
      boxShadow: '0 4px 20px rgba(34,211,238,0.2)',
    }}
    role="button"
    aria-label={`Restore ${title}`}
  >
    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
    <span className="text-sm text-cyan-400 font-medium">{title}</span>
  </motion.div>
);

const WindowButtons = ({
  onClose,
  onMinimize,
  title = 'Window',
  children,
  className = '',
  initialMinimized = false,
  initialFullscreen = false,
}: WindowButtonsProps) => {
  const [windowState, setWindowState] = useState<WindowState>(
    initialMinimized ? 'minimized' : initialFullscreen ? 'fullscreen' : 'normal'
  );
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  const handleMinimize = useCallback(() => {
    setWindowState((s) => (s === 'minimized' ? 'normal' : 'minimized'));
    onMinimize?.();
  }, [onMinimize]);

  const handleToggleFullscreen = useCallback(() => {
    setWindowState((s) => (s === 'fullscreen' ? 'normal' : 'fullscreen'));
  }, []);

  const handleRestore = useCallback(() => {
    setWindowState('normal');
  }, []);

  if (!isVisible) return null;

  if (windowState === 'minimized') {
    return (
      <AnimatePresence>
        <DockIcon title={title} onClick={handleRestore} />
      </AnimatePresence>
    );
  }

  const containerClass =
    windowState === 'fullscreen'
      ? 'fixed inset-0 z-50 rounded-none'
      : `relative rounded-xl ${className}`;

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={containerClass}
        style={{
          background: 'linear-gradient(135deg, #131328 0%, #0a0a14 100%)',
          border: '1px solid rgba(49,46,129,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}
        role="dialog"
        aria-label={title}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(49,46,129,0.4)', background: 'rgba(30,27,75,0.5)' }}
        >
          {/* Traffic-light buttons */}
          <div className="flex items-center gap-2">
            {/* Red – close */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-red-400"
              style={{ background: '#ef4444' }}
              title="Close"
              aria-label="Close window"
            >
              <X className="h-2 w-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            {/* Yellow – minimize */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMinimize}
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{ background: '#f59e0b' }}
              title="Minimize"
              aria-label="Minimize window"
            >
              <Minus className="h-2 w-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            {/* Green – fullscreen toggle */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFullscreen}
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-green-400"
              style={{ background: '#22c55e' }}
              title={windowState === 'fullscreen' ? 'Restore' : 'Fullscreen'}
              aria-label={windowState === 'fullscreen' ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {windowState === 'fullscreen' ? (
                <Minimize2 className="h-2 w-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Maximize2 className="h-2 w-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.button>
          </div>

          {/* Title */}
          <span className="text-xs text-gray-400 font-medium select-none absolute left-1/2 -translate-x-1/2">
            {title}
          </span>

          <div className="w-16" />
        </div>

        {/* Content */}
        <motion.div
          layout
          className={windowState === 'fullscreen' ? 'h-[calc(100vh-48px)] overflow-auto' : ''}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WindowButtons;
