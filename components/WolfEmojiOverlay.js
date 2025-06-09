import React, { useEffect, useState } from 'react';

function WolfEmojiOverlay() {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    const animals = ['🐶', '🦊', '🐱', '🐵', '🐼', '🦁', '🐸'];
    const generated = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      content: animals[i % animals.length],
      size: 16 + Math.random() * 24,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 5,
      spinDuration: 3 + Math.random() * 6,
      spin: Math.random() < 0.5,
    }));
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
          }}
        >
          {e.content}
        </div>
      ))}
    </div>
  );
}

export default WolfEmojiOverlay;
