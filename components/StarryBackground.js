import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const EXTRA_ICONS = ['🐔', '🛸', '👾', '🐤', '🦄'];

const StarryBackground = () => {
  const [stars, setStars] = useState([]);
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      size: Math.random() > 0.6 ? 'large' : 'small',
    }));
    setStars(generatedStars);

    const generatedIcons = Array.from({ length: EXTRA_ICONS.length }, (_, i) => ({
      id: i,
      icon: EXTRA_ICONS[i],
      top: Math.random() * 100,
      duration: 25 + Math.random() * 20,
    }));
    setIcons(generatedIcons);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: star.size === 'large' ? 0.8 : 0.4,
          }}
        >
          {star.size === 'large' ? (
            <Star size={10} className="text-white fill-white" />
          ) : (
            <div
              className="bg-white rounded-full"
              style={{ width: '2px', height: '2px' }}
            />
          )}
        </div>
      ))}

      {/* Planets */}
      <div
        className="absolute top-1/4 left-1/6 animate-spin opacity-30"
        style={{ animationDuration: '20s' }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-orange-300">
          <circle cx="20" cy="20" r="12" fill="currentColor" />
          <ellipse cx="20" cy="20" rx="18" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="20" cy="20" rx="16" ry="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>
      <div
        className="absolute top-3/4 right-1/4 animate-spin opacity-25"
        style={{ animationDuration: '25s' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-400">
          <circle cx="16" cy="16" r="12" fill="currentColor" />
          <path d="M8 12 Q12 8 16 12 Q20 8 24 12 Q20 16 16 20 Q12 16 8 12" fill="rgba(34, 197, 94, 0.8)" />
          <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </svg>
      </div>
      <div
        className="absolute top-1/2 right-1/6 animate-spin opacity-20"
        style={{ animationDuration: '30s' }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" className="text-red-400">
          <circle cx="14" cy="14" r="10" fill="currentColor" />
          <circle cx="10" cy="10" r="2" fill="rgba(139, 69, 19, 0.6)" />
          <circle cx="18" cy="16" r="1.5" fill="rgba(139, 69, 19, 0.6)" />
          <circle cx="12" cy="18" r="1" fill="rgba(139, 69, 19, 0.6)" />
        </svg>
      </div>
      <div
        className="absolute top-1/6 right-1/3 animate-spin opacity-15"
        style={{ animationDuration: '35s' }}
      >
        <svg width="45" height="45" viewBox="0 0 45 45" className="text-yellow-500">
          <circle cx="22.5" cy="22.5" r="18" fill="currentColor" />
          <ellipse cx="22.5" cy="18" rx="16" ry="2" fill="rgba(255, 165, 0, 0.8)" />
          <ellipse cx="22.5" cy="22.5" rx="15" ry="1.5" fill="rgba(255, 140, 0, 0.8)" />
          <ellipse cx="22.5" cy="27" rx="14" ry="2" fill="rgba(255, 165, 0, 0.8)" />
          <circle cx="18" cy="20" r="1.5" fill="rgba(139, 69, 19, 0.6)" />
        </svg>
      </div>
      <div
        className="absolute top-2/3 left-1/3 animate-spin opacity-35"
        style={{ animationDuration: '15s' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-300">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <circle cx="8" cy="8" r="1.5" fill="rgba(156, 163, 175, 0.6)" />
          <circle cx="16" cy="10" r="1" fill="rgba(156, 163, 175, 0.6)" />
          <circle cx="10" cy="16" r="0.8" fill="rgba(156, 163, 175, 0.6)" />
          <circle cx="14" cy="16" r="1.2" fill="rgba(156, 163, 175, 0.6)" />
        </svg>
      </div>

      {icons.map((icon) => (
        <div
          key={`icon-${icon.id}`}
          className="absolute text-xl animate-move-across"
          style={{
            top: `${icon.top}%`,
            animationDuration: `${icon.duration}s`,
          }}
        >
          {icon.icon}
        </div>
      ))}
    </div>
  );
};

export default StarryBackground;
