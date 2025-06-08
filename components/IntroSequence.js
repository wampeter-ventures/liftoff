import React, { useState, useEffect } from 'react';
import { Star, Atom, Satellite, Orbit, Radar, Zap, Sparkles, Snowflake } from 'lucide-react';

function IntroSequence({ onComplete, stars }) {
    const [phase, setPhase] = useState(1); // 1: rocket fade in, 2: stars fade out, 3: game board transition
    const [animatedElements, setAnimatedElements] = useState([]);

    // Generate animated background elements
    useEffect(() => {
        const elements = [];
        
        // Generate stars with top-to-bottom movement
        for (let i = 0; i < 30; i++) {
            elements.push({
                id: `star-${i}`,
                type: 'star',
                left: Math.random() * 100,
                top: -10 - Math.random() * 50, // Start above viewport
                size: Math.random() > 0.7 ? 'large' : 'small',
                speed: 2 + Math.random() * 3,
                twinkleDelay: Math.random() * 3,
                twinkleDuration: 1 + Math.random() * 2
            });
        }
        
        // Generate planets with rotation and movement
        const planetTypes = [
            { emoji: '🪐', color: '#F4D47C' }, // Saturn
            { emoji: '🌍', color: '#075056' }, // Earth
            { emoji: '🔴', color: '#FF5B04' }, // Mars
            { emoji: '🌕', color: '#D3DBDD' }, // Moon
            { emoji: '☄️', color: '#FDF6E3' }  // Comet
        ];
        
        for (let i = 0; i < 8; i++) {
            const planet = planetTypes[Math.floor(Math.random() * planetTypes.length)];
            elements.push({
                id: `planet-${i}`,
                type: 'planet',
                emoji: planet.emoji,
                color: planet.color,
                left: Math.random() * 100,
                top: -20 - Math.random() * 100,
                size: 20 + Math.random() * 25,
                speed: 1 + Math.random() * 2,
                rotationSpeed: 10 + Math.random() * 20
            });
        }
        
        // Generate space emojis and icons
        const spaceEmojis = ['🛸', '👽', '🚀', '⭐', '✨', '💫', '🌟', '🌠'];
        const spaceIcons = [Atom, Satellite, Orbit, Radar, Zap, Sparkles, Snowflake];
        
        for (let i = 0; i < 15; i++) {
            if (Math.random() > 0.5) {
                // Emoji
                elements.push({
                    id: `emoji-${i}`,
                    type: 'emoji',
                    emoji: spaceEmojis[Math.floor(Math.random() * spaceEmojis.length)],
                    left: Math.random() * 100,
                    top: -10 - Math.random() * 80,
                    size: 15 + Math.random() * 20,
                    speed: 1.5 + Math.random() * 2.5,
                    rotationSpeed: 5 + Math.random() * 15
                });
            } else {
                // Icon
                elements.push({
                    id: `icon-${i}`,
                    type: 'icon',
                    Icon: spaceIcons[Math.floor(Math.random() * spaceIcons.length)],
                    left: Math.random() * 100,
                    top: -10 - Math.random() * 80,
                    size: 15 + Math.random() * 20,
                    speed: 1.5 + Math.random() * 2.5,
                    rotationSpeed: 5 + Math.random() * 15,
                    color: ['#F4D47C', '#FF5B04', '#075056', '#233038', '#D3DBDD'][Math.floor(Math.random() * 5)]
                });
            }
        }
        
        setAnimatedElements(elements);
    }, []);

    // Animate elements moving down
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimatedElements(prevElements => {
                const newElements = [...prevElements];
                
                // Update positions and add new elements from top
                const updatedElements = newElements.map(element => ({
                    ...element,
                    top: element.top + element.speed
                })).filter(element => element.top < 120); // Remove elements that went off screen
                
                // Add new elements occasionally
                if (Math.random() < 0.3) {
                    const elementTypes = ['star', 'planet', 'emoji', 'icon'];
                    const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
                    
                    if (type === 'star') {
                        updatedElements.push({
                            id: `star-new-${Date.now()}`,
                            type: 'star',
                            left: Math.random() * 100,
                            top: -10,
                            size: Math.random() > 0.7 ? 'large' : 'small',
                            speed: 2 + Math.random() * 3,
                            twinkleDelay: Math.random() * 3,
                            twinkleDuration: 1 + Math.random() * 2
                        });
                    } else if (type === 'planet') {
                        const planetTypes = [
                            { emoji: '🪐', color: '#F4D47C' },
                            { emoji: '🌍', color: '#075056' },
                            { emoji: '🔴', color: '#FF5B04' },
                            { emoji: '🌕', color: '#D3DBDD' },
                            { emoji: '☄️', color: '#FDF6E3' }
                        ];
                        const planet = planetTypes[Math.floor(Math.random() * planetTypes.length)];
                        updatedElements.push({
                            id: `planet-new-${Date.now()}`,
                            type: 'planet',
                            emoji: planet.emoji,
                            color: planet.color,
                            left: Math.random() * 100,
                            top: -20,
                            size: 20 + Math.random() * 25,
                            speed: 1 + Math.random() * 2,
                            rotationSpeed: 10 + Math.random() * 20
                        });
                    } else if (type === 'emoji') {
                        const spaceEmojis = ['🛸', '👽', '🚀', '⭐', '✨', '💫', '🌟', '🌠'];
                        updatedElements.push({
                            id: `emoji-new-${Date.now()}`,
                            type: 'emoji',
                            emoji: spaceEmojis[Math.floor(Math.random() * spaceEmojis.length)],
                            left: Math.random() * 100,
                            top: -10,
                            size: 15 + Math.random() * 20,
                            speed: 1.5 + Math.random() * 2.5,
                            rotationSpeed: 5 + Math.random() * 15
                        });
                    } else {
                        const spaceIcons = [Atom, Satellite, Orbit, Radar, Zap, Sparkles, Snowflake];
                        updatedElements.push({
                            id: `icon-new-${Date.now()}`,
                            type: 'icon',
                            Icon: spaceIcons[Math.floor(Math.random() * spaceIcons.length)],
                            left: Math.random() * 100,
                            top: -10,
                            size: 15 + Math.random() * 20,
                            speed: 1.5 + Math.random() * 2.5,
                            rotationSpeed: 5 + Math.random() * 15,
                            color: ['#F4D47C', '#FF5B04', '#075056', '#233038', '#D3DBDD'][Math.floor(Math.random() * 5)]
                        });
                    }
                }
                
                return updatedElements;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timers = [
            // Phase 1: Rocket fades in (1s)
            setTimeout(() => setPhase(2), 1000),
            // Phase 2: Stars fade out (1s after rocket is visible)
            setTimeout(() => setPhase(3), 2000),
            // Phase 3: Transition to game (1s after stars fade)
            setTimeout(() => onComplete(), 3000)
        ];

        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="intro-sequence">
            {/* Animated Background Elements */}
            <div className={`intro-stars ${phase >= 2 ? 'fade-out' : ''}`}>
                {animatedElements.map((element) => {
                    if (element.type === 'star') {
                        return (
                            <div
                                key={element.id}
                                className="intro-star"
                                style={{
                                    left: `${element.left}%`,
                                    top: `${element.top}%`,
                                    animationDelay: `${element.twinkleDelay}s`,
                                    animationDuration: `${element.twinkleDuration}s`,
                                }}
                            >
                                <Star
                                    size={element.size === 'large' ? 12 : 6}
                                    className="text-white fill-white animate-pulse"
                                    style={{
                                        filter: 'drop-shadow(0 0 4px white)',
                                        opacity: element.size === 'large' ? 0.9 : 0.6
                                    }}
                                />
                            </div>
                        );
                    } else if (element.type === 'planet') {
                        return (
                            <div
                                key={element.id}
                                className="intro-planet"
                                style={{
                                    left: `${element.left}%`,
                                    top: `${element.top}%`,
                                    fontSize: `${element.size}px`,
                                    animation: `introRotate ${element.rotationSpeed}s linear infinite`,
                                    filter: `drop-shadow(0 0 6px ${element.color})`,
                                    opacity: 0.8
                                }}
                            >
                                {element.emoji}
                            </div>
                        );
                    } else if (element.type === 'emoji') {
                        return (
                            <div
                                key={element.id}
                                className="intro-emoji"
                                style={{
                                    left: `${element.left}%`,
                                    top: `${element.top}%`,
                                    fontSize: `${element.size}px`,
                                    animation: `introSpin ${element.rotationSpeed}s linear infinite`,
                                    filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))',
                                    opacity: 0.7
                                }}
                            >
                                {element.emoji}
                            </div>
                        );
                    } else if (element.type === 'icon') {
                        const IconComponent = element.Icon;
                        return (
                            <div
                                key={element.id}
                                className="intro-icon"
                                style={{
                                    left: `${element.left}%`,
                                    top: `${element.top}%`,
                                    animation: `introFloat ${element.rotationSpeed}s ease-in-out infinite`,
                                    opacity: 0.6
                                }}
                            >
                                <IconComponent
                                    size={element.size}
                                    style={{
                                        color: element.color,
                                        filter: `drop-shadow(0 0 4px ${element.color})`
                                    }}
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Rocket Image with vibration */}
            <div className={`intro-rocket ${phase >= 1 ? 'fade-in' : ''} ${phase >= 3 ? 'fade-to-background' : ''}`}>
                <img
                    src="/rocket_big.png"
                    alt="Mission Rocket"
                    className="rocket-intro-image"
                    style={{
                        animation: phase >= 1 ? 'rocketVibrate 0.15s linear infinite' : 'none'
                    }}
                />
            </div>

            {/* Mission text overlay */}
            <div className={`intro-text ${phase >= 1 ? 'fade-in' : ''} ${phase >= 3 ? 'fade-out' : ''}`}>
                <h2 style={{ animation: 'textPulse 2s ease-in-out infinite' }}>Mission Initialized</h2>
                <p style={{ animation: 'textGlow 3s ease-in-out infinite' }}>Prepare for Launch</p>
            </div>
        </div>
    );
}

export default IntroSequence;