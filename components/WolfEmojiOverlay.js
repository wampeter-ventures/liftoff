import React, { useEffect, useState } from 'react';

function WolfEmojiOverlay() {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    const animals = ['🐶', '🦊', '🐱', '🐵', '🐼', '🦁', '🐸'];
    const generated = Array.from({ length: 12 }, (_, i) => {
      const fromTop = Math.random() < 0.5;
      return {
        id: i,
        content: animals[i % animals.length],
        size: 16 + Math.random() * 24,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 5,
        spinDuration: 3 + Math.random() * 6,
        spin: Math.random() < 0.5,
        startFromTop: fromTop,
        startLeft: fromTop ? `${Math.random() * 100}vw` : 'calc(100vw + 40px)',
        startTop: fromTop ? '-40px' : `${Math.random() * 80}vh`,
      };
    });
    setEmojis(generated);
  }, []);

  return (
    <div className="wolf-emoji-overlay">
      {emojis.map((e) => (
        <div
          key={e.id}
          className={`emoji${e.spin ? ' spin' : ''}`}
          style={{
            fontSize: `${e.size}px`,
            animationDuration: `${e.duration}s${e.spin ? `, ${e.spinDuration}s` : ''}`,
            animationDelay: `${e.delay}s${e.spin ? `, ${e.delay}s` : ''}`,
            top: e.startTop,
            left: e.startLeft,
          }}
        >
          {e.content}
        </div>
      ))}
    </div>
  );
}

export default WolfEmojiOverlay;
