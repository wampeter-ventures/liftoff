import { useState, useRef } from 'react';

function Die({ die, draggable = false, onDragStart, onDragEnd, onClick, className = '', isSelected = false }) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState(null);
    const dragRef = useRef(null);

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

    // Enhanced touch handlers for mobile drag simulation
    const handleTouchStart = (e) => {
        if (!draggable || die.placed) return;

        const touch = e.touches[0];
        setDragStartPos({ x: touch.clientX, y: touch.clientY });
        setIsDragging(false);
        dragRef.current = e.currentTarget;
        
        // Prevent default to avoid scrolling
        e.preventDefault();
    };

    const handleTouchMove = (e) => {
        if (!draggable || die.placed || !dragStartPos) return;
        
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - dragStartPos.x);
        const deltaY = Math.abs(touch.clientY - dragStartPos.y);
        
        // Start dragging if moved more than 10px
        const dieEl = dragRef.current || e.currentTarget;

        if (!isDragging && (deltaX > 10 || deltaY > 10)) {
            setIsDragging(true);
            console.log('📱 Mobile drag started');

            // Select the die first (for click-to-place system)
            if (onClick) {
                onClick(die);
            }

            // Add visual feedback
            dieEl.classList.add('dragging');
            dieEl.style.pointerEvents = 'none';

            // Apply live transform to follow finger
            const offsetX = touch.clientX - dragStartPos.x;
            const offsetY = touch.clientY - dragStartPos.y;
            dieEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.1) rotate(5deg)`;
            dieEl.style.zIndex = '1000';
            
            // Simulate drag start for desktop compatibility
            if (onDragStart) {
                const syntheticEvent = {
                    target: e.target,
                    dataTransfer: {
                        setData: () => {},
                        effectAllowed: 'move'
                    }
                };
                onDragStart(syntheticEvent, die);
            }
        }
        
        if (isDragging) {
            // Update position to follow finger
            const offsetX = touch.clientX - dragStartPos.x;
            const offsetY = touch.clientY - dragStartPos.y;
            dieEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.1) rotate(5deg)`;
            
            // Find element under touch point
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Clear previous drag-over states
            document.querySelectorAll('.drag-over').forEach(el => {
                el.classList.remove('drag-over');
            });
            
            // Find closest drop target
            let dropTarget = elementBelow;
            while (dropTarget && !dropTarget.classList.contains('grid-slot') && 
                   !dropTarget.classList.contains('fire-drop-zone')) {
                dropTarget = dropTarget.parentElement;
            }
            
            if (dropTarget) {
                dropTarget.classList.add('drag-over');
            }
        }
        
        e.preventDefault();
    };

    const handleTouchEnd = (e) => {
        if (!draggable || die.placed) return;
        
        const dieEl = dragRef.current || e.currentTarget;

        if (isDragging) {
            console.log('📱 Mobile drag ended');

            // Clean up visual transforms
            dieEl.style.transform = '';
            dieEl.style.zIndex = '';
            dieEl.classList.remove('dragging');
            dieEl.style.pointerEvents = '';

            // Clear drag-over states
            document.querySelectorAll('.drag-over').forEach(el => {
                el.classList.remove('drag-over');
            });
            
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Find drop target
            let dropTarget = elementBelow;
            while (dropTarget && !dropTarget.classList.contains('grid-slot') && 
                   !dropTarget.classList.contains('fire-drop-zone')) {
                dropTarget = dropTarget.parentElement;
            }
            
            if (dropTarget) {
                // For mobile drag, we'll use the existing selection system
                if (
                    dropTarget.classList.contains('grid-slot') ||
                    dropTarget.classList.contains('fire-drop-zone')
                ) {
                    // Dispatch a click after releasing to place the die
                    setTimeout(() => {
                        dropTarget.dispatchEvent(
                            new MouseEvent('click', { bubbles: true })
                        );
                    }, 0);
                }
            }
            
            // Simulate drag end
            if (onDragEnd) {
                onDragEnd({ target: dieEl });
            }
        } else if (dragStartPos) {
            // This was a tap, not a drag
            const touch = e.changedTouches[0];
            const deltaX = Math.abs(touch.clientX - dragStartPos.x);
            const deltaY = Math.abs(touch.clientY - dragStartPos.y);
            
            if (deltaX < 10 && deltaY < 10) {
                // Small movement, treat as click
                if (onClick) {
                    onClick(die);
                }
            }
        }
        
        setIsDragging(false);
        setDragStartPos(null);
        dragRef.current = null;
        e.preventDefault();
    };

    // Regular click handler - this handles desktop clicks and mobile tap fallback
    const handleClick = (e) => {
        if (!isDragging && onClick) {
            onClick(die);
        }
    };

    const isBooster = die.value === 6;
    const isFireDie = die.inFire;

    return (
        <div
            className={`die ${className} ${die.placed ? 'placed' : ''} ${isBooster ? 'booster-die' : ''} ${isFireDie ? 'fire-die' : ''} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} player-${die.playerId}`}
            draggable={draggable && !die.placed}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleClick}
            style={{
                cursor: draggable && !die.placed ? 'grab' : (onClick ? 'pointer' : 'default')
            }}
            data-value={die.value}
            data-player={die.playerName}
        >
            {renderPips(die.value)}
        </div>
    );
}

export default Die; 