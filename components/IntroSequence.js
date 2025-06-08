import React, { useState, useEffect } from 'react';
import { Star, Atom, Satellite, Orbit, Radar, Zap, Sparkles, Snowflake, Globe as Planet, Disc3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

function IntroSequence({ onComplete, stars }) {
    const [phase, setPhase] = useState(1); // 1: fade in, 2: liftoff, 3: show levels
    const [animatedElements, setAnimatedElements] = useState([]);

    // Hardest at the top, easiest (Mars) at the bottom
    const levels = [
        { name: 'Eris', emoji: '⚫' },
        { name: 'Makemake', emoji: '🍡' },
        { name: 'Haumea', emoji: '🥚' },
        { name: 'Pluto', emoji: '🤎' },
        { name: 'Neptune', Icon: Planet },
        { name: 'Uranus', emoji: '🔵' },
        { name: 'Saturn', Icon: Disc3 },
        { name: 'Jupiter', Icon: Planet },
        { name: 'Ceres', emoji: '⚪' },
        { name: 'Mars', Icon: Orbit },
    ];

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
            { emoji: '🪐', color: '#FFA500' }, // Saturn
            { emoji: '🌍', color: '#4169E1' }, // Earth
            { emoji: '🔴', color: '#FF4500' }, // Mars
            { emoji: '🌕', color: '#C0C0C0' }, // Moon
            { emoji: '☄️', color: '#FFD700' }  // Comet
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
                    color: ['#FFD700', '#FFA500', '#FF6B35', '#4169E1', '#32CD32'][Math.floor(Math.random() * 5)]
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
                            { emoji: '🪐', color: '#FFA500' },
                            { emoji: '🌍', color: '#4169E1' },
                            { emoji: '🔴', color: '#FF4500' },
                            { emoji: '🌕', color: '#C0C0C0' },
                            { emoji: '☄️', color: '#FFD700' }
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
                            color: ['#FFD700', '#FFA500', '#FF6B35', '#4169E1', '#32CD32'][Math.floor(Math.random() * 5)]
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
            setTimeout(() => setPhase(2), 1000), // start liftoff
            setTimeout(() => setPhase(3), 2000) // show levels card
        ];

        return () => timers.forEach(clearTimeout);
    }, []);

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
            <div className={`intro-rocket ${phase >= 1 ? 'fade-in' : ''} ${phase >= 2 ? 'liftoff' : ''} ${phase >= 3 ? 'fade-to-background' : ''}`}>
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
            <div className={`intro-text ${phase >= 1 ? 'fade-in' : ''} ${phase >= 2 ? 'fade-out' : ''}`}>
                <h2 style={{ animation: 'textPulse 2s ease-in-out infinite' }}>Mission Initialized</h2>
                <p style={{ animation: 'textGlow 3s ease-in-out infinite' }}>Prepare for Launch</p>
            </div>

            {phase >= 3 && (
                <div className={`intro-levels-card slide-up`}>
                    <Card className="w-72 bg-slate-800/80 text-white text-center">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold">Mission Briefing</CardTitle>
                            <p className="text-xs mt-1">The more boosters we have, the farther we can go.</p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center space-y-1 text-sm">
                                {levels.map((lvl) => (
                                    <div key={lvl.name} className="flex items-center space-x-1">
                                        {lvl.Icon ? (
                                            <lvl.Icon className="h-4 w-4" />
                                        ) : (
                                            <span>{lvl.emoji}</span>
                                        )}
                                        <span>{lvl.name}</span>
                                    </div>
                                ))}
                            </div>
                            <Button className="mt-3 w-full" onClick={onComplete}>BUILD →</Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default IntroSequence;
