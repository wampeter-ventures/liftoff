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
        if (onDragStart) {
            onDragStart(e, die);
        }
    };

    const handleDragEndEvent = (e) => {
        if (onDragEnd) {
            onDragEnd(e);
        }
    };

    const handleTouchStart = (e) => {
        if (!draggable || die.placed) return;
        
        const touch = e.touches[0];
        
        // Store touch data for drag detection
        e.currentTarget.touchStartData = {
            startX: touch.clientX,
            startY: touch.clientY,
            startTime: Date.now(),
            moved: false
        };
        
        // Visual feedback - make it more visible but keep the die visible
        e.currentTarget.style.transform = 'scale(1.15)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        e.currentTarget.style.zIndex = '100';
    };

    const handleTouchMove = (e) => {
        if (!draggable || die.placed) return;
        
        const touch = e.touches[0];
        const touchData = e.currentTarget.touchStartData;
        
        if (touchData) {
            const deltaX = Math.abs(touch.clientX - touchData.startX);
            const deltaY = Math.abs(touch.clientY - touchData.startY);
            
            // If moved more than 15px, consider it a drag
            if (deltaX > 15 || deltaY > 15) {
                touchData.moved = true;
                setIsDragging(true);
                
                // Enhance visual feedback for drag
                e.currentTarget.style.opacity = '0.8';
                
                // Prevent scrolling during drag
                e.preventDefault();
            }
        }
    };

    const handleTouchEnd = (e) => {
        if (!draggable || die.placed) return;
        
        const touchData = e.currentTarget.touchStartData;
        
        // Reset visual styles
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.zIndex = '';
        e.currentTarget.style.opacity = '';
        
        if (touchData) {
            const touch = e.changedTouches[0];
            const timeDiff = Date.now() - touchData.startTime;
            
            if (touchData.moved && timeDiff > 100) {
                // This was a drag - find what's under the touch point
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                
                if (elementBelow) {
                    // Look for drop targets
                    let dropTarget = elementBelow;
                    let maxAttempts = 5; // Prevent infinite loops
                    
                    while (dropTarget && maxAttempts > 0) {
                        if (dropTarget.dataset && dropTarget.dataset.position) {
                            // Found a grid slot - trigger standard drop handling
                            const fakeEvent = {
                                preventDefault: () => {},
                                dataTransfer: {
                                    getData: () => JSON.stringify(die)
                                }
                            };
                            
                            // Find and call the drop handler
                            if (dropTarget.ondrop) {
                                dropTarget.ondrop(fakeEvent);
                            } else {
                                // Dispatch a regular drop event
                                const dropEvent = new DragEvent('drop', {
                                    bubbles: true,
                                    cancelable: true
                                });
                                Object.defineProperty(dropEvent, 'dataTransfer', {
                                    value: {
                                        getData: () => JSON.stringify(die)
                                    }
                                });
                                dropTarget.dispatchEvent(dropEvent);
                            }
                            break;
                        } else if (dropTarget.classList && dropTarget.classList.contains('fire-drop-zone')) {
                            // Found fire zone - trigger click handler
                            if (dropTarget.onclick) {
                                dropTarget.onclick(e);
                            }
                            break;
                        }
                        
                        dropTarget = dropTarget.parentElement;
                        maxAttempts--;
                    }
                }
            } else {
                // This was a tap/click - call the click handler
                if (onClick) {
                    onClick(e);
                }
            }
            
            // Clean up
            delete e.currentTarget.touchStartData;
        }
        
        setIsDragging(false);
    };

    const handleClick = (e) => {
        // Always handle clicks for desktop
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
            onDragStart={handleDragStartEvent}
            onDragEnd={handleDragEndEvent}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            data-value={die.value}
            data-player={die.playerName}
        >
            {renderPips(die.value)}
        </div>
    );
}

export default Die; 