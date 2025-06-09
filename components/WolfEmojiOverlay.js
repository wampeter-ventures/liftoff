import React, { useEffect, useState } from 'react';

function WolfEmojiOverlay() {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    const animals = ['🐶','🦊','🐱','🐵','🐼','🦁','🐸'];
    const generated = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      content: animals[i % animals.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 20 + Math.random() * 10,
      duration: 25 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setEmojis(generated);
  }, []);

  return (
    <div className="wolf-emoji-overlay">
      {emojis.map((e) => (
        <div
          key={e.id}
          className="emoji"
          style={{
            left: `${e.left}%`,
            top: `${e.top}%`,
            fontSize: `${e.size}px`,
            animationDuration: `${e.duration}s, ${e.duration}s, 3s`,
            animationDelay: `${e.delay}s`,
          }}
        >
          {e.content}
        </div>
      ))}
    </div>
  );
}

export default WolfEmojiOverlay;
