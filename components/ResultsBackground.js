import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

function ResultsBackground() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 20 + Math.random() * 20,
      size: Math.random() > 0.6 ? 'large' : 'small',
    }));

    setStars(generatedStars);
  }, []);

  const planets = [
    {
      id: 'saturn',
      svg: (
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-orange-300">
          <circle cx="20" cy="20" r="12" fill="currentColor" />
          <ellipse cx="20" cy="20" rx="18" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="20" cy="20" rx="16" ry="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </svg>
      ),
      duration: 50,
    },
    {
      id: 'earth',
      svg: (
        <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-400">
          <circle cx="16" cy="16" r="12" fill="currentColor" />
          <path d="M8 12 Q12 8 16 12 Q20 8 24 12 Q20 16 16 20 Q12 16 8 12" fill="rgba(34,197,94,0.8)" />
          <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </svg>
      ),
      duration: 60,
    },
  ];

  const animalEmojis = ['🐶', '🦊', '🐵', '🐱', '🐼', '🦁', '🐸'];
  const funIcons = animalEmojis.map((emoji, i) => ({
    id: `animal-${i}`,
    content: emoji,
    size: 24,
    duration: 40 + Math.random() * 30,
  }));

  return (
    <div className="results-background pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        >
          {star.size === 'large' ? (
            <Star size={8} className="text-white" />
          ) : (
            <div className="bg-white rounded-full" style={{ width: '2px', height: '2px' }} />
          )}
        </div>
      ))}

      {planets.map((p) => (
        <div
          key={p.id}
          className="planet"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.svg}
        </div>
      ))}

      {funIcons.map((f) => (
        <div
          key={f.id}
          className="fun-icon"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${f.size}px`,
            animationDuration: `${f.duration}s`,
          }}
        >
          {f.content}
        </div>
      ))}
    </div>
  );
}

export default ResultsBackground;
