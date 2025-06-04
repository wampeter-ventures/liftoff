import { useState } from 'react';

function Die({ die, draggable = false, onDragStart, onDragEnd, onClick, className = '', isSelected = false }) {
    const renderPips = (value) => {
        const pipConfigs = {
            1: [[2, 2]],
            2: [[1, 1], [3, 3]],
            3: [[1, 1], [2, 2], [3, 3]],
            4: [[1, 1], [1, 3], [3, 1], [3, 3]],
            5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
            6: [[1, 1], [1, 3], [2, 1], [2, 3], [3, 1], [3, 3]]
        };

        const pips = pipConfigs[value] || [];
        
        return (
            <svg className="die-face" viewBox="0 0 100 100">
                <rect 
                    x="5" y="5" 
                    width="90" height="90" 
                    rx="15" 
                    fill="white" 
                    stroke="#333" 
                    strokeWidth="2"
                />
                {pips.map(([row, col], index) => (
                    <circle
                        key={index}
                        cx={20 + (col - 1) * 30}
                        cy={20 + (row - 1) * 30}
                        r="6"
                        fill="#333"
                    />
                ))}
            </svg>
        );
    };

    // Desktop drag handlers - these work perfectly and include visual feedback
    const handleDragStart = (e) => {
        console.log('🎯 Die handleDragStart called:', { die: die.value, draggable, placed: die.placed });
        
        if (!draggable || die.placed) {
            console.log('❌ Die drag prevented:', { draggable, placed: die.placed });
            e.preventDefault();
            return;
        }
        
        console.log('✅ Die drag starting, calling onDragStart prop');
        if (onDragStart) {
            onDragStart(e, die);  // This calls DiceRoll's handleDragStart which adds .dragging class and sets dataTransfer
        } else {
            console.log('❌ No onDragStart prop provided!');
        }
    };

    const handleDragEnd = (e) => {
        console.log('🏁 Die handleDragEnd called');
        if (onDragEnd) {
            onDragEnd(e);  // This calls DiceRoll's handleDragEnd which removes .dragging class
        } else {
            console.log('❌ No onDragEnd prop provided!');
        }
    };

    // Simple touch handlers that don't interfere with clicks
    const handleTouchStart = (e) => {
        // Only add minimal data, don't prevent anything
        if (!draggable || die.placed) return;
        e.currentTarget.touchData = { startTime: Date.now() };
    };

    const handleTouchEnd = (e) => {
        // Clean up without interfering
        if (e.currentTarget.touchData) {
            delete e.currentTarget.touchData;
        }
    };

    // Regular click handler - this handles mobile taps and desktop clicks
    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    const isBooster = die.value === 6;
    const isFireDie = die.inFire;

    return (
        <div
            className={`die ${className} ${die.placed ? 'placed' : ''} ${isBooster ? 'booster-die' : ''} ${isFireDie ? 'fire-die' : ''} ${isSelected ? 'selected' : ''} player-${die.playerId}`}
            draggable={draggable && !die.placed}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
                console.log('🖱️ Die clicked:', { die: die.value, draggable, placed: die.placed });
                if (onClick) onClick(die);
            }}
            style={{
                cursor: draggable && !die.placed ? 'grab' : (onClick ? 'pointer' : 'default'),
                opacity: die.placed ? 0.5 : 1
            }}
            data-value={die.value}
            data-player={die.playerName}
        >
            {renderPips(die.value)}
        </div>
    );
}

export default Die; 