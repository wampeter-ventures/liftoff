import { useState, useEffect } from 'react';
import Die from './Die';

function DiceRoll({ dice, onDragStart, selectedDie, onSelectDie }) {
    const [draggedDie, setDraggedDie] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [rollingDice, setRollingDice] = useState([]);

    const handleDragStart = (e, die) => {
        if (die.placed) return;
        
        setDraggedDie(die);
        e.dataTransfer.setData('text/plain', JSON.stringify(die));
        e.dataTransfer.effectAllowed = 'move';
        
        // Add visual feedback
        e.target.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
        setDraggedDie(null);
    };

    const handleDieClick = (die) => {
        if (die.placed || isRolling) return;
        if (onSelectDie) {
            onSelectDie(die);
        }
    };

    // Show rolling animation when new dice arrive
    useEffect(() => {
        if (dice.length > 0 && !dice.some(d => d.placed)) {
            setIsRolling(true);
            // Generate random rolling dice for animation
            const rolling = dice.map(d => ({ ...d, value: Math.floor(Math.random() * 6) + 1 }));
            setRollingDice(rolling);
            
            const interval = setInterval(() => {
                setRollingDice(prev => prev.map(d => ({ ...d, value: Math.floor(Math.random() * 6) + 1 })));
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                setIsRolling(false);
                setRollingDice([]);
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [dice.length]);

    const availableDice = dice.filter(d => !d.placed);
    const displayDice = isRolling ? rollingDice : availableDice;

    return (
        <div className="dice-roll-container">
            <h3>
                {availableDice.length > 0 ? availableDice[0].playerName : 'Available Dice'}
            </h3>
            
            {availableDice.length === 0 ? (
                <div className="no-dice">
                    <i className="fas fa-check-circle"></i>
                    All dice placed!
                </div>
            ) : (
                <div className="player-dice-group">
                    <div className="dice-container">
                        {displayDice.map(die => (
                            <Die
                                key={die.id}
                                die={die}
                                draggable={!isRolling}
                                onDragStart={(e) => handleDragStart(e, die)}
                                onDragEnd={handleDragEnd}
                                onClick={() => handleDieClick(die)}
                                className="available-die"
                                isSelected={selectedDie && selectedDie.id === die.id}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="dice-instructions">
                {(() => {
                    if (availableDice.length === 0) return '';
                    
                    // Check if any unplaced dice can be placed
                    const unplacedDice = availableDice.filter(die => !die.placed);
                    if (unplacedDice.length === 0) return '';
                    
                    // This will be updated to use GameLogic import in the main component
                    const hasValidPlacements = true; // Simplified for now
                    
                    if (hasValidPlacements) {
                        return "Click or drag dice: ⚙️ Rocket body  (1-5)  🔋 Boosters (6)";
                    } else {
                        return "No eligible body parts or boosters, send a die to the fire! 🔥 ";
                    }
                })()}
            </div>
        </div>
    );
}

export default DiceRoll; 