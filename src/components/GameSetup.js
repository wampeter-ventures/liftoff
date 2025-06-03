const { useState } = React;

function GameSetup({ onStartGame }) {
    const [playerCount, setPlayerCount] = useState(1);
    const [players, setPlayers] = useState([{ name: 'Player 1', diceCount: 6 }]);

    const updatePlayerCount = (count) => {
        setPlayerCount(count);
        const newPlayers = [];
        for (let i = 0; i < count; i++) {
            if (players[i]) {
                newPlayers.push(players[i]);
            } else {
                newPlayers.push({
                    id: i + 1,
                    name: `Player ${i + 1}`,
                    diceCount: 6
                });
            }
        }
        setPlayers(newPlayers);
    };

    const updatePlayer = (index, field, value) => {
        const newPlayers = [...players];
        newPlayers[index] = { ...newPlayers[index], [field]: value };
        setPlayers(newPlayers);
    };

    const handleStartGame = () => {
        // Validate player setup
        const hasValidPlayers = players.every(p => 
            p.name.trim() !== '' && p.diceCount > 0 && p.diceCount <= 20
        );

        if (!hasValidPlayers) {
            alert('Please ensure all players have valid names and dice counts (1-20).');
            return;
        }

        onStartGame(players);
    };

    return (
        <div className="game-setup">
            <div className="setup-container">
                <div className="setup-section">
                    <label htmlFor="player-count">Number of Players (1-8):</label>
                    <select 
                        id="player-count"
                        value={playerCount} 
                        onChange={(e) => updatePlayerCount(parseInt(e.target.value))}
                        className="player-count-select"
                    >
                        {[1,2,3,4,5,6,7,8].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div className="players-config">
                    <h3>Configure Players</h3>
                    {players.map((player, index) => (
                        <div key={index} className="player-config">
                            <div className="player-config-row">
                                <div className="player-name-group">
                                    <label htmlFor={`player-${index}-name`}>Name:</label>
                                    <input
                                        id={`player-${index}-name`}
                                        type="text"
                                        value={player.name}
                                        onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                                        placeholder={`Player ${index + 1}`}
                                        className="player-name-input"
                                    />
                                </div>
                                <div className="dice-count-group">
                                    <label htmlFor={`player-${index}-dice`}>Dice:</label>
                                    <input
                                        id={`player-${index}-dice`}
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={player.diceCount}
                                        onChange={(e) => updatePlayer(index, 'diceCount', parseInt(e.target.value) || 1)}
                                        className="dice-count-input"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="setup-rules">
                    <h3>Quick Rules</h3>
                    <p><strong>GOAL:</strong> Send rocket to space before it explodes! Bigger body before boosters = farther destinations.</p>
                    <ul>
                        <li><strong>TURN:</strong> Roll dice, place ≥1 touching existing dice</li>
                        <li>Body: faces 1-5 in ascending rows</li>
                        <li>Boosters: face 6 touching lowest row (locks height)</li>
                        <li>Can't place? Send one to Fire Pile</li>
                        <li><strong>Fire = 5 → explosion (LOSS)</strong></li>
                        <li><strong>LIFTOFF:</strong> Complete body + ≥1 booster, roll boosters for 6</li>
                    </ul>
                </div>

                <button 
                    onClick={handleStartGame}
                    className="btn btn-primary btn-large"
                >
                    Start Mission
                </button>
            </div>
        </div>
    );
}

window.GameSetup = GameSetup;
