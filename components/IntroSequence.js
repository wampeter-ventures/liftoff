import React, { useState, useEffect } from 'react';

function IntroSequence({ onComplete, stars }) {
    const [phase, setPhase] = useState(1); // 1: rocket fade in, 2: stars fade out, 3: game board transition

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
            {/* Starry Background */}
            <div className={`intro-stars ${phase >= 2 ? 'fade-out' : ''}`}>
                <div className="stars-container">
                    {stars.map((star) => (
                        <div
                            key={star.id}
                            className="star animate-twinkle"
                            style={{
                                left: `${star.left}%`,
                                top: `${star.top}%`,
                                animationDelay: `${star.delay}s`,
                                animationDuration: `${star.duration}s`,
                                opacity: star.size === 'large' ? 0.8 : 0.4
                            }}
                        >
                            <div
                                className="bg-white rounded-full"
                                style={{
                                    width: star.size === 'large' ? '6px' : '3px',
                                    height: star.size === 'large' ? '6px' : '3px'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Animated planets */}
                <div className="planet planet-1"></div>
                <div className="planet planet-2"></div>
                <div className="planet planet-3"></div>
            </div>

            {/* Rocket Image */}
            <div className={`intro-rocket ${phase >= 1 ? 'fade-in' : ''} ${phase >= 3 ? 'fade-to-background' : ''}`}>
                <img
                    src="/rocket_big.png"
                    alt="Mission Rocket"
                    className="rocket-intro-image"
                />
            </div>

            {/* Mission text overlay */}
            <div className={`intro-text ${phase >= 1 ? 'fade-in' : ''} ${phase >= 3 ? 'fade-out' : ''}`}>
                <h2>Mission Initialized</h2>
                <p>Prepare for Launch</p>
            </div>
        </div>
    );
}

export default IntroSequence;