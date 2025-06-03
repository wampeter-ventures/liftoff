import GameLogic from '../lib/gameLogic';

function GameResults({
    rocketGrid,
    firePile,
    rocketHeight,
    boosterRowLocked,
    onRestart,
}) {
    const { calculateVictoryLevel, getCompletedRows } = GameLogic;

    const victoryLevel = calculateVictoryLevel(
        rocketGrid,
        rocketHeight,
        boosterRowLocked,
    );
    const completedRows = getCompletedRows(rocketGrid);
    const isVictory = firePile < 5 && victoryLevel > 0;

    const getDestination = () => {
        if (firePile >= 5) {
            return { name: "EXPLOSION", icon: "💥" };
        }

        switch (victoryLevel) {
            case 1:
                return { name: "MOON", icon: "🌙" };
            case 2:
                return { name: "MARS", icon: "🔴" };
            case 3:
                return { name: "JUPITER", icon: "🪐" };
            default:
                return { name: "FAILED LAUNCH", icon: "❌" };
        }
    };

    const getResultDescription = () => {
        const destination = getDestination();

        if (firePile >= 5) {
            return "Too many dice went into the fire pile. The rocket exploded!";
        }

        if (victoryLevel === 0) {
            return "The rocket didn't have enough structure to launch.";
        }

        return `Mission successful! Your rocket reached ${destination.name}!`;
    };

    const getResultIcon = () => {
        if (firePile >= 5) {
            return "fas fa-explosion";
        }

        switch (victoryLevel) {
            case 1:
                return "fas fa-rocket";
            case 2:
                return "fas fa-satellite";
            case 3:
                return "fas fa-space-shuttle";
            default:
                return "fas fa-times-circle";
        }
    };

    const renderRocketSummary = () => {
        return (
            <div className="rocket-summary">
                <h3>Final Rocket Configuration</h3>
                <div className="summary-grid">
                    {[5, 4, 3, 2, 1].map((row) => (
                        <div
                            key={row}
                            className={`summary-row ${completedRows.includes(row) ? "completed" : ""}`}
                        >
                            <div className="row-label">Row {row}</div>
                            <div className="row-slots">
                                {Array.from({ length: row }, (_, col) => {
                                    const position = `${row}-${col + 1}`;
                                    const die = rocketGrid[position];
                                    return (
                                        <div
                                            key={position}
                                            className={`summary-slot ${die ? "filled" : "empty"}`}
                                        >
                                            {die ? die.value : "·"}
                                        </div>
                                    );
                                })}
                            </div>
                            {completedRows.includes(row) && (
                                <i className="fas fa-check completion-check"></i>
                            )}
                        </div>
                    ))}

                    <div
                        className={`summary-row booster-summary ${boosterRowLocked ? "has-boosters" : ""}`}
                    >
                        <div className="row-label">Boosters</div>
                        <div className="row-slots">
                            {Array.from(
                                { length: rocketHeight || 5 },
                                (_, col) => {
                                    const position = `booster-${col + 1}`;
                                    const die = rocketGrid[position];
                                    return (
                                        <div
                                            key={position}
                                            className={`summary-slot ${die ? "filled" : "empty"}`}
                                        >
                                            {die ? die.value : "·"}
                                        </div>
                                    );
                                },
                            )}
                        </div>
                        {boosterRowLocked && (
                            <i className="fas fa-fire completion-check"></i>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const destination = getDestination();

    return (
        <div className="game-results">
            <div className="results-container">
                <div
                    className={`result-header ${isVictory ? "victory" : "failure"}`}
                >
                    <div className="destination-icon">{destination.icon}</div>
                    <h1 className="result-title">{destination.name}</h1>
                    <p className="result-description">
                        {getResultDescription()}
                    </p>
                </div>

                <div className="results-stats">
                    <div className="stat-item">
                        <div className="stat-value">{completedRows.length}</div>
                        <div className="stat-label">Completed Rows</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{firePile}</div>
                        <div className="stat-label">Failed Launches</div>
                    </div>
                </div>

                <div className="results-actions">
                    <button
                        onClick={onRestart}
                        className="btn btn-primary btn-large"
                    >
                        New Mission
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameResults; 