import { useState, useEffect } from 'react';
import Die from './Die';
import GameLogic from '../lib/gameLogic';

function DiceRoll({ dice, onDragStart, selectedDie, onSelectDie, rocketGrid, rocketHeight, boosterRowLocked }) {
    const [draggedDie, setDraggedDie] = useState(null);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
    const [isRolling, setIsRolling] = useState(false);
    const [rollingDice, setRollingDice] = useState([]);

    useEffect(() => {
        if (!draggedDie) return;

        const handleDragOver = (e) => {
            setDragPos({ x: e.clientX, y: e.clientY });
        };

        document.addEventListener('dragover', handleDragOver);
        return () => {
            document.removeEventListener('dragover', handleDragOver);
        };
    }, [draggedDie]);


    const handleDragStart = (e, die) => {
        console.log('🎮 DiceRoll handleDragStart called:', { die: die.value, placed: die.placed });

        if (die.placed) {
            console.log('❌ DiceRoll drag prevented: die already placed');
            return;
        }

        console.log('✅ DiceRoll setting up drag data and visual feedback');
        setDraggedDie(die);
        setDragPos({ x: e.clientX, y: e.clientY });
        e.dataTransfer.setData('text/plain', JSON.stringify(die));
        // Hide default ghost image so we can use our custom preview
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        e.dataTransfer.effectAllowed = 'move';

        // Add visual feedback
        e.target.classList.add('dragging');
        console.log('✅ Added .dragging class to:', e.target);

        // Call parent onDragStart if provided
        if (onDragStart) {
            console.log('📞 Calling parent onDragStart');
            onDragStart(e, die);
        } else {
            console.log('❌ No parent onDragStart provided!');
        }
    };

    const handleDrag = (e) => {
        setDragPos({ x: e.clientX, y: e.clientY });
    };

    const handleDragEnd = (e) => {
        console.log('🏁 DiceRoll handleDragEnd called');
        e.target.classList.remove('dragging');
        setDraggedDie(null);
        console.log('✅ Removed .dragging class and cleared draggedDie');
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
        <>
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
                                onDrag={handleDrag}
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

                    // Check if any dice from this roll have already been placed
                    const anyDicePlaced = dice.some(die => die.placed);

                    // Check if any of the unplaced dice have valid placements on the rocket
                    const hasValidPlacements = unplacedDice.some(die => {
                        const validPositions = GameLogic.getValidPositions(
                            die.value,
                            rocketGrid,
                            rocketHeight,
                            boosterRowLocked
                        );
                        return validPositions.length > 0;
                    });

                    if (hasValidPlacements) {
                        return `Click or drag dice:
⚙️ Body part (1-5) 🔋 Boosters (6)`;
                    } else if (!anyDicePlaced) {
                        // Only show fire message if this is a fresh roll with no eligible dice
                        return 'No eligible body parts or boosters, send a die to the fire! 🔥 ';
                    } else {
                        // Some dice were already placed, show regular message
                        return `Click or drag dice:
⚙️ Body part (1-5) 🔋 Boosters (6)`;
                    }
                })()}
            </div>
        </div>
        {draggedDie && (
            <div
                className="drag-preview"
                style={{ left: dragPos.x, top: dragPos.y }}
            >
                <Die die={draggedDie} className="available-die dragging" />
            </div>
        )}
        </>
    );
}

export default DiceRoll;
