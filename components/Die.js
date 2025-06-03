import { useState } from 'react';

function Die({ die, draggable = false, onDragStart, onDragEnd, onClick, className = '', isSelected = false }) {
    const [touchData, setTouchData] = useState(null);
    
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

    const handleTouchStart = (e) => {
        if (!draggable || die.placed) return;
        
        const touch = e.touches[0];
        
        // Create a simple visual indicator for dragging
        const rect = e.target.getBoundingClientRect();
        const dragIndicator = document.createElement('div');
        
        dragIndicator.style.position = 'fixed';
        dragIndicator.style.top = rect.top + 'px';
        dragIndicator.style.left = rect.left + 'px';
        dragIndicator.style.width = '60px';
        dragIndicator.style.height = '60px';
        dragIndicator.style.backgroundColor = '#ff0000';
        dragIndicator.style.border = '3px solid #000';
        dragIndicator.style.borderRadius = '8px';
        dragIndicator.style.zIndex = '99999';
        dragIndicator.style.pointerEvents = 'none';
        dragIndicator.style.opacity = '0.8';
        dragIndicator.style.display = 'flex';
        dragIndicator.style.alignItems = 'center';
        dragIndicator.style.justifyContent = 'center';
        dragIndicator.style.fontSize = '24px';
        dragIndicator.style.fontWeight = 'bold';
        dragIndicator.style.color = '#fff';
        dragIndicator.textContent = die.value;
        dragIndicator.id = 'drag-indicator';
        
        document.body.appendChild(dragIndicator);
        console.log('Drag indicator created:', dragIndicator);
        
        setTouchData({
            startX: touch.clientX,
            startY: touch.clientY,
            die: die,
            clone: dragIndicator,
            originalRect: rect
        });
        
        // Hide original
        e.target.style.opacity = '0.3';
        
        // Call drag start for consistency
        if (onDragStart) {
            const mockEvent = {
                dataTransfer: {
                    setData: () => {},
                    effectAllowed: 'move'
                },
                target: e.target
            };
            onDragStart(mockEvent, die);
        }
    };

    const handleTouchMove = (e) => {
        if (!touchData || !touchData.clone) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchData.startX;
        const deltaY = touch.clientY - touchData.startY;
        
        // Move the clone with finger
        const newLeft = touchData.originalRect.left + deltaX;
        const newTop = touchData.originalRect.top + deltaY;
        
        touchData.clone.style.left = newLeft + 'px';
        touchData.clone.style.top = newTop + 'px';
        
        console.log('Moving clone to:', newLeft, newTop);
    };

    const handleTouchEnd = (e) => {
        if (!touchData) return;
        
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Clean up clone
        if (touchData.clone) {
            document.body.removeChild(touchData.clone);
        }
        
        // Reset visual state
        e.target.style.opacity = '';
        e.target.style.transform = '';
        e.target.style.zIndex = '';
        e.target.style.position = '';
        e.target.style.pointerEvents = '';
        
        // Find drop target
        let dropTarget = elementBelow;
        while (dropTarget && !dropTarget.dataset.position && !dropTarget.classList.contains('fire-drop-zone')) {
            dropTarget = dropTarget.parentElement;
        }
        
        if (dropTarget) {
            if (dropTarget.dataset.position) {
                // Drop on grid position
                if (window.dropDieOnGrid) {
                    window.dropDieOnGrid(touchData.die, dropTarget.dataset.position);
                }
            } else if (dropTarget.classList.contains('fire-drop-zone')) {
                // Drop on fire
                if (window.sendToFire) {
                    window.sendToFire(touchData.die);
                }
            }
        }
        
        setTouchData(null);
        if (onDragEnd) onDragEnd(e);
    };

    const handleClick = (e) => {
        // Don't trigger click if we're dragging or if it's a touch event handled by touch handlers
        if (touchData) return;
        
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
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
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