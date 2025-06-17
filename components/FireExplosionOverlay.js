import React from 'react';
import { Flame } from 'lucide-react';

function FireExplosionOverlay() {
  const flames = Array.from({ length: 50 });
  return (
    <div className="fire-explosion-overlay">
      {flames.map((_, i) => (
        <Flame
          key={i}
          className="flame-icon explosion-flame"
          size={24}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

export default FireExplosionOverlay;
