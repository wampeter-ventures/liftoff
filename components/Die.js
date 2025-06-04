import { useState } from 'react';

function Die({ die, draggable = false, onDragStart, onDragEnd, onClick, className = '', isSelected = false }) {
    const [isDragging, setIsDragging] = useState(false);
    
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

    const handleDragStartEvent = (e) => {
        if (!draggable || die.placed) return;
        setIsDragging(true);
        if (onDragStart) {
            onDragStart(e, die);
        }
    };

    const handleDragEndEvent = (e) => {
        setIsDragging(false);
        if (onDragEnd) {
            onDragEnd(e);
        }
    };

    const handleTouchStart = (e) => {
        if (!draggable || die.placed) return;
        setIsDragging(true);
        
        // Store initial touch position for mobile drag detection
        const touch = e.touches[0];
        e.target.dataset.touchStartX = touch.clientX;
        e.target.dataset.touchStartY = touch.clientY;
        e.target.dataset.hasMoved = 'false';
        
        // Add visual feedback for mobile
        e.target.style.transform = 'scale(1.1)';
        e.target.style.opacity = '0.8';
        e.target.style.zIndex = '1000';
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const startX = parseFloat(e.target.dataset.touchStartX || '0');
        const startY = parseFloat(e.target.dataset.touchStartY || '0');
        
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);
        
        // If user has moved more than 10px, mark as dragging
        if (deltaX > 10 || deltaY > 10) {
            e.target.dataset.hasMoved = 'true';
        }
        
        // Prevent scrolling while dragging
        e.preventDefault();
    };

    const handleTouchEnd = (e) => {
        if (!isDragging) return;
        
        // Reset visual state
        e.target.style.transform = '';
        e.target.style.opacity = '';
        e.target.style.zIndex = '';
        
        const hasMoved = e.target.dataset.hasMoved === 'true';
        
        if (hasMoved) {
            // This was a drag operation
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            
            if (elementBelow) {
                // Find the drop target by traversing up the DOM
                let dropTarget = elementBelow;
                while (dropTarget && 
                       !dropTarget.dataset.position && 
                       !dropTarget.classList.contains('fire-drop-zone') &&
                       dropTarget !== document.body) {
                    dropTarget = dropTarget.parentElement;
                }
                
                if (dropTarget && dropTarget.dataset.position) {
                    // Create a synthetic drop event for the grid slot
                    const mockEvent = {
                        preventDefault: () => {},
                        dataTransfer: {
                            getData: () => JSON.stringify(die)
                        }
                    };
                    
                    // Trigger the drop event on the grid slot
                    const dropEvent = new CustomEvent('drop', {
                        bubbles: true,
                        detail: { mockEvent, die, position: dropTarget.dataset.position }
                    });
                    dropTarget.dispatchEvent(dropEvent);
                } else if (dropTarget && dropTarget.classList.contains('fire-drop-zone')) {
                    // Handle fire drop
                    const fireDropEvent = new CustomEvent('fireDropMobile', {
                        bubbles: true,
                        detail: { die }
                    });
                    dropTarget.dispatchEvent(fireDropEvent);
                }
            }
        } else {
            // This was a tap, treat as click
            if (onClick) {
                onClick(e);
            }
        }
        
        setIsDragging(false);
        
        // Clean up
        delete e.target.dataset.touchStartX;
        delete e.target.dataset.touchStartY;
        delete e.target.dataset.hasMoved;
    };

    const handleClick = (e) => {
        // Only handle click if it wasn't a drag operation
        if (!isDragging && onClick) {
            onClick(e);
        }
    };

    const isBooster = die.value === 6;
    const isFireDie = die.inFire;

    return (
        <div
            className={`die ${className} ${die.placed ? 'placed' : ''} ${isBooster ? 'booster-die' : ''} ${isFireDie ? 'fire-die' : ''} ${isSelected ? 'selected' : ''} player-${die.playerId}`}
            draggable={draggable && !die.placed}
            onDragStart={handleDragStartEvent}
            onDragEnd={handleDragEndEvent}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            data-value={die.value}
            data-player={die.playerName}
            style={{ touchAction: 'none' }} // Prevent default touch behaviors
        >
            {renderPips(die.value)}
        </div>
    );
}

export default Die; 