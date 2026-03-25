import { useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';

interface BrochureCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: string;
}

const BrochureCard = ({ id, title, description, icon, highlight }: BrochureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: -8,
        boxShadow: '0 12px 32px rgba(52, 211, 153, 0.2)',
        duration: 300,
        easing: 'easeOutQuad',
      });
    }
    if (iconRef.current) {
      anime({
        targets: iconRef.current,
        rotate: '1turn',
        scale: 1.2,
        duration: 500,
        easing: 'easeOutBack',
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: 0,
        boxShadow: '0 0px 0px rgba(52, 211, 153, 0)',
        duration: 300,
        easing: 'easeOutQuad',
      });
    }
    if (iconRef.current) {
      anime({
        targets: iconRef.current,
        rotate: 0,
        scale: 1,
        duration: 400,
        easing: 'easeOutQuad',
      });
    }
  };

  return (
    <Link
      to={`/business-platform?tab=brochure&id=${id}`}
      className="block"
    >
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="service-card flex flex-col h-full cursor-pointer border border-transparent hover:border-emerald-400/30"
      >
        <div
          ref={iconRef}
          className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-400/10"
        >
          {icon}
        </div>
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
          {highlight}
        </span>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-400 flex-grow">{description}</p>
        <div className="mt-4 text-emerald-400 text-sm font-medium flex items-center gap-1">
          View Brochure
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default BrochureCard;
