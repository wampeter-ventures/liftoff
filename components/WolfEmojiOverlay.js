import React, { useEffect, useState } from 'react';

function WolfEmojiOverlay() {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    const animals = ['🐶', '🦊', '🐱', '🐵', '🐼', '🦁', '🐸'];
    const generated = Array.from({ length: 8 }, (_, i) => {
      const fromTop = Math.random() < 0.5;
      const exitBottom = Math.random() < 0.5;
      return {
        id: i,
        content: animals[i % animals.length],
        size: 16 + Math.random() * 24,
        duration: 8 + Math.random() * 6,
        delay: Math.random() * 8,
        spinDuration: 3 + Math.random() * 6,
        spin: Math.random() < 0.5,
        startFromTop: fromTop,
        startLeft: fromTop ? `${Math.random() * 100}vw` : 'calc(100vw + 40px)',
        startTop: fromTop ? '-40px' : `${Math.random() * 80}vh`,
        endLeft: exitBottom ? `${Math.random() * 100}vw` : '-40px',
        endTop: exitBottom ? 'calc(100vh + 40px)' : `${Math.random() * 100}vh`,
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
            '--end-top': e.endTop,
            '--end-left': e.endLeft,
          }}
        >
          {e.content}
        </div>
      ))}
    </div>
  );
}

export default WolfEmojiOverlay;
