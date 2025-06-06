import React from 'react';
import { Star } from 'lucide-react';

function StarryBackground({ stars, starColor = '#ffffff', children }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars && stars.map((star) => (
        <div
          key={star.id}
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
            <Star size={10} style={{ color: starColor }} className="fill-current" />
          ) : (
            <div
              className="rounded-full"
              style={{ width: '2px', height: '2px', backgroundColor: starColor }}
            />
          )}
        </div>
      ))}
      {children}
    </div>
  );
}

export default StarryBackground;
