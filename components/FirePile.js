function FirePile({ count, onDropDie, fireDice = [] }) {
    const { useState } = React;
    const [dragOver, setDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        
        try {
            const dieData = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (window.sendToFire) {
                window.sendToFire(dieData);
            }
        } catch (error) {
            console.error('Error dropping die to fire:', error);
        }
    };

    const flameIntensity = Math.min(count / 5, 1);
    const flameColor = count >= 4 ? '#ff4444' : count >= 2 ? '#ff8844' : '#ffaa44';

    return (
        <div className="fire-pile-container">
            <h3>
                <i className="fas fa-fire"></i>
                Fire Pile
            </h3>
            
            <div 
                className={`fire-pile ${dragOver ? 'drag-over' : ''} ${count >= 4 ? 'danger' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="fire-visual" style={{ opacity: flameIntensity }}>
                    <svg className="flame-svg" viewBox="0 0 100 120">
                        {/* Main flame */}
                        <path
                            d="M50 120 C30 120, 20 100, 20 80 C20 60, 30 50, 40 40 C45 20, 55 10, 50 0 C60 15, 70 25, 75 40 C80 50, 80 70, 70 80 C75 90, 70 100, 50 120 Z"
                            fill={flameColor}
                            opacity="0.8"
                        />
                        {/* Inner flame */}
                        <path
                            d="M50 110 C35 110, 30 95, 30 80 C30 65, 35 60, 40 50 C45 35, 50 25, 50 15 C55 30, 60 40, 65 50 C70 60, 70 75, 65 80 C68 90, 65 100, 50 110 Z"
                            fill="#ffcc44"
                            opacity="0.6"
                        />
                        {/* Core flame */}
                        <path
                            d="M50 100 C40 100, 38 90, 38 80 C38 70, 42 65, 45 60 C47 50, 50 45, 50 35 C52 45, 55 50, 58 60 C60 65, 62 75, 60 80 C62 85, 60 95, 50 100 Z"
                            fill="#fff8aa"
                            opacity="0.4"
                        />
                    </svg>
                </div>

                <div className="fire-dice-display">
                    {fireDice.map((die, index) => (
                        <Die key={die.id} die={{...die, inFire: true}} className="fire-die-small" />
                    ))}
                </div>

                <div className="fire-count">
                    <span className="count-number">{count}</span>
                    <span className="count-max">/ 5</span>
                </div>

                {count === 0 && (
                    <div className="fire-placeholder">
                        <i className="fas fa-fire"></i>
                        <div>Drop unused dice here</div>
                    </div>
                )}

                {count >= 4 && (
                    <div className="danger-warning">
                        <i className="fas fa-exclamation-triangle"></i>
                        DANGER!
                    </div>
                )}
            </div>

            <div className="fire-progress">
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ 
                            width: `${(count / 5) * 100}%`,
                            backgroundColor: flameColor
                        }}
                    ></div>
                </div>
                <div className="progress-label">
                    {5 - count} dice until explosion
                </div>
            </div>

            <div className="fire-instructions">
                <i className="fas fa-info-circle"></i>
                Double-click dice or drag here to discard
            </div>
        </div>
    );
}

// Make sendToFire available globally for Die component
window.sendToFire = null;

window.FirePile = FirePile;
