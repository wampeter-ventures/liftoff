import React, { useState, useEffect } from 'react';
import Die from './Die';

function LaunchResults({ boosterRolls, success }) {
    const [isRolling, setIsRolling] = useState(true);
    const [animatedRolls, setAnimatedRolls] = useState([]);
    const [showFinalRolls, setShowFinalRolls] = useState(false);

    useEffect(() => {
        // Start with random rolls
        setAnimatedRolls(boosterRolls.map(() => Math.floor(Math.random() * 6) + 1));
        setIsRolling(true);
        setShowFinalRolls(false);

        // Dramatic rolling animation sequence
        const intervals = [];
        
        // Phase 1: Super fast rolling (80ms)
        const hyperRoll = setInterval(() => {
            setAnimatedRolls(boosterRolls.map(() => Math.floor(Math.random() * 6) + 1));
        }, 80);
        intervals.push(hyperRoll);

        setTimeout(() => {
            clearInterval(hyperRoll);
            
            // Phase 2: Fast rolling (150ms)
            const fastRoll = setInterval(() => {
                setAnimatedRolls(boosterRolls.map(() => Math.floor(Math.random() * 6) + 1));
            }, 150);
            intervals.push(fastRoll);

            setTimeout(() => {
                clearInterval(fastRoll);
                
                // Phase 3: Slower dramatic settle (300ms)
                const slowRoll = setInterval(() => {
                    setAnimatedRolls(boosterRolls.map(() => Math.floor(Math.random() * 6) + 1));
                }, 300);
                intervals.push(slowRoll);

                setTimeout(() => {
                    clearInterval(slowRoll);
                    // Final reveal
                    setIsRolling(false);
                    setAnimatedRolls(boosterRolls);
                    setShowFinalRolls(true);
                }, 1200);
            }, 1000);
        }, 800);

        return () => intervals.forEach(clearInterval);
    }, [boosterRolls]);

    return (
        <div className="launch-results">
            <div className="booster-rolls-header">
                <h4 className="booster-rolls-title">
                    {isRolling ? "🎲 ROLLING FOR GLORY... 🎲" : success ? "✨ VICTORIOUS ROLLS! ✨" : "💀 DOOM ROLLS 💀"}
                </h4>
                <p className="booster-rolls-subtitle">
                    {isRolling 
                        ? "The fate of your rocket hangs in the balance..." 
                        : success 
                        ? "AT LEAST ONE GLORIOUS SIX HAS BLESSED YOUR VESSEL!" 
                        : "Alas! No sixes were rolled. Your rocket is but a fancy lawn ornament."
                    }
                </p>
            </div>

            <div className="booster-dice-container">
                {animatedRolls.map((roll, index) => {
                    const dieData = {
                        id: `booster-${index}`,
                        value: roll,
                        playerName: 'Booster',
                        placed: false
                    };
                    
                    const isSix = roll === 6;
                    const shouldGlow = showFinalRolls && isSix;
                    
                    return (
                        <div 
                            key={index}
                            className={`booster-die-wrapper ${isRolling ? 'rolling' : ''} ${shouldGlow ? 'glorious-six' : ''}`}
                        >
                            <Die 
                                die={dieData}
                                className={`booster-die ${shouldGlow ? 'golden-die' : ''}`}
                            />
                            {shouldGlow && (
                                <div className="six-celebration">🌟</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showFinalRolls && (
                <div className="launch-verdict">
                    <p className="verdict-text">
                        {success 
                            ? "🎉 Your rocket EXPLODES into the cosmos with magnificent fury! 🎉" 
                            : "😭 Your rocket sulks on the launchpad, dreaming of flight but achieving only disappointment. 😭"
                        }
                    </p>
                    {!success && (
                        <p className="failure-explanation">
                            (Need at least one 6 to achieve rocket-powered greatness!)
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default LaunchResults; 