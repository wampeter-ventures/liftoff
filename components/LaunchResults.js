import React, { useState, useEffect } from 'react';
import Die from './Die';

function LaunchResults({ boosterRolls, success, onComplete }) {
    const [isRolling, setIsRolling] = useState(true);
    const [animatedRolls, setAnimatedRolls] = useState([]);
    const [showFinalRolls, setShowFinalRolls] = useState(false);

    useEffect(() => {
        setIsRolling(true);
        setShowFinalRolls(false);
        setAnimatedRolls([]);

        const intervals = [];
        const timeouts = [];

        const rollDie = (index) => {
            if (index >= boosterRolls.length) {
                setIsRolling(false);
                setShowFinalRolls(true);
                if (onComplete) onComplete();
                return;
            }

            // Add placeholder for this die
            setAnimatedRolls((prev) => [...prev, Math.floor(Math.random() * 6) + 1]);

            const interval = setInterval(() => {
                setAnimatedRolls((prev) =>
                    prev.map((v, i) => (i === index ? Math.floor(Math.random() * 6) + 1 : v))
                );
            }, 100);
            intervals.push(interval);

            const timeout = setTimeout(() => {
                clearInterval(interval);
                setAnimatedRolls((prev) =>
                    prev.map((v, i) => (i === index ? boosterRolls[index] : v))
                );
                rollDie(index + 1);
            }, 1000);
            timeouts.push(timeout);
        };

        rollDie(0);

        return () => {
            intervals.forEach(clearInterval);
            timeouts.forEach(clearTimeout);
        };
    }, [boosterRolls]);

    return (
        <div className="launch-results">
            <div className="booster-rolls-header">
                <h4 className="booster-rolls-title">
                    {isRolling ? '🎲 ROLLING FOR GLORY... 🎲' : success ? '✨ VICTORIOUS ROLLS! ✨' : '💀 DOOM ROLLS 💀'}
                </h4>
                <p className="booster-rolls-subtitle">
                    {isRolling
                        ? 'The fate of your rocket hangs in the balance...'
                        : success
                        ? 'AT LEAST ONE GLORIOUS SIX HAS BLESSED YOUR VESSEL!'
                        : 'Alas! No sixes were rolled. Your rocket is but a fancy lawn ornament.'
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
                            ? '🎉 Your rocket EXPLODES into the cosmos with magnificent fury! 🎉'
                            : '😭 Your rocket sulks on the launchpad, dreaming of flight but achieving only disappointment. 😭'
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