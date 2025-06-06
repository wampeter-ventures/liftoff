import React, { useState, useEffect } from 'react';
import Die from './Die';

function LaunchResults({ boosterRolls, success }) {
    const [isRolling, setIsRolling] = useState(true);
    const [animatedRolls, setAnimatedRolls] = useState([]);
    const [showFinalRolls, setShowFinalRolls] = useState(false);

    useEffect(() => {
        const intervals = [];
        const timeouts = [];
        setAnimatedRolls(Array(boosterRolls.length).fill(null));
        setIsRolling(true);
        setShowFinalRolls(false);

        boosterRolls.forEach((finalRoll, idx) => {
            const startDelay = idx * 700;
            const startTimeout = setTimeout(() => {
                const rollInterval = setInterval(() => {
                    setAnimatedRolls((prev) => {
                        const arr = [...prev];
                        arr[idx] = Math.floor(Math.random() * 6) + 1;
                        return arr;
                    });
                }, 100);
                intervals.push(rollInterval);

                const settleTimeout = setTimeout(() => {
                    clearInterval(rollInterval);
                    setAnimatedRolls((prev) => {
                        const arr = [...prev];
                        arr[idx] = finalRoll;
                        return arr;
                    });
                }, 600);
                timeouts.push(settleTimeout);
            }, startDelay);
            timeouts.push(startTimeout);
        });

        const finishTimeout = setTimeout(() => {
            setIsRolling(false);
            setShowFinalRolls(true);
        }, boosterRolls.length * 700 + 700);
        timeouts.push(finishTimeout);

        return () => {
            intervals.forEach(clearInterval);
            timeouts.forEach(clearTimeout);
        };
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