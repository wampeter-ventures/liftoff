const { useState, useEffect } = React;

function App() {
    const [gameState, setGameState] = useState("welcome");
    const [players, setPlayers] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [rocketGrid, setRocketGrid] = useState({});
    const [firePile, setFirePile] = useState(0);
    const [currentDice, setCurrentDice] = useState([]);
    const [placedDice, setPlacedDice] = useState([]);
    const [gameHistory, setGameHistory] = useState([]);
    const [rocketHeight, setRocketHeight] = useState(0);
    const [boosterRowLocked, setBoosterRowLocked] = useState(false);
    const [fireDice, setFireDice] = useState([]);
    const [showLaunchHelper, setShowLaunchHelper] = useState(false);
    const [selectedDie, setSelectedDie] = useState(null);

    useEffect(() => {
        const grid = {};
        for (let row = 1; row <= 6; row++) {
            for (let col = 1; col <= row; col++) {
                grid[`${row}-${col}`] = null;
            }
        }
        setRocketGrid(grid);

        // Override GameLogic for unified placement logic
        const waitForGameLogic = () => {
            if (!window.GameLogic) {
                setTimeout(waitForGameLogic, 50);
                return;
            }
            window.GameLogic.isValidPlacement = function (
                pos,
                val,
                grid,
                height,
                boostersLocked,
            ) {
                if (grid[pos]) return false;
                const [rowStr, colStr] = pos.split("-");
                const row = parseInt(rowStr),
                    col = parseInt(colStr);

                // Check for regular dice in row (not 6)
                const rowHasRegular = Object.keys(grid).some((k) => {
                    const [r] = k.split("-");
                    return (
                        parseInt(r) === row && grid[k] && grid[k].value !== 6
                    );
                });
                const rowHasSix = Object.keys(grid).some((k) => {
                    const [r] = k.split("-");
                    return (
                        parseInt(r) === row && grid[k] && grid[k].value === 6
                    );
                });

                // Find lowest row with any 1-5 in it (rocket body)
                let lowestBody = 0;
                Object.keys(grid).forEach((k) => {
                    const [r] = k.split("-");
                    const d = grid[k];
                    if (d && d.value >= 1 && d.value <= 5) {
                        lowestBody = Math.max(lowestBody, parseInt(r));
                    }
                });

                // 6 placement (booster)
                if (val === 6) {
                    // Don't allow 6 at apex!

                    if (row === 1 && col === 1) return false;
                    // cannot share a row that already has 1‑5

                    if (rowHasRegular) return false;
                    const expectedBoosterRow = lowestBody + 1;
                    if (!boostersLocked) {
                        if (row !== expectedBoosterRow) return false;
                    } else {
                        // Lock to the booster row
                        const br = Object.keys(grid).find(
                            (k) => grid[k] && grid[k].value === 6,
                        );
                        if (br && row !== parseInt(br.split("-")[0]))
                            return false;
                    }
                    return window.GameLogic.hasAdjacentDie(pos, grid, height);
                }

                // 1-5 placement (body)
                if (val !== col) return false; // must match slot label
                if (rowHasSix) return false; // can't place in row w/ 6s
                if (boostersLocked && row > height) return false; // can't go under boosters
                return window.GameLogic.hasAdjacentDie(pos, grid, height);
            };
        };
        waitForGameLogic();
    }, []);

    useEffect(() => {
        if (gameState === "playing" && players.length > 0) {
            setCurrentDice([]);
            setPlacedDice([]);
            setGameHistory([]);
            setTimeout(() => {
                rollDiceForCurrentPlayer();
            }, 50);
        }
    }, [currentPlayerIndex, gameState]);

    const startGame = (playerData) => {
        setPlayers(playerData);
        setGameState("playing");
        setCurrentPlayerIndex(0);
        rollDiceForCurrentPlayer(playerData);
    };

    const rollDiceForCurrentPlayer = (playerData = players) => {
        if (!playerData || playerData.length === 0) return;
        const currentPlayer = playerData[currentPlayerIndex];
        if (!currentPlayer) return;
        setCurrentDice([]);
        setPlacedDice([]);
        setGameHistory([]);
        setSelectedDie(null);
        const diceResults = [];
        for (let i = 0; i < currentPlayer.diceCount; i++) {
            diceResults.push({
                id: `${currentPlayer.name}-${i}-${Date.now()}`,
                value: Math.floor(Math.random() * 6) + 1,
                playerId: currentPlayer.id,
                playerName: currentPlayer.name,
                placed: false,
            });
        }
        setCurrentDice(diceResults);
    };

    const placeDie = (die, position) => {
        if (!window.GameLogic || !window.GameLogic.isValidPlacement) {
            return false;
        }
        const isValid = window.GameLogic.isValidPlacement(
            position,
            die.value,
            rocketGrid,
            rocketHeight,
            boosterRowLocked,
        );
        if (!isValid) return false;

        const newGrid = { ...rocketGrid };
        newGrid[position] = { ...die, placed: true };
        setRocketGrid(newGrid);

        if (die.value === 6) {
            setBoosterRowLocked(true);
        } else {
            const row = parseInt(position.split("-")[0]);
            setRocketHeight(Math.max(rocketHeight, row));
        }

        const updatedDice = currentDice.map((d) =>
            d.id === die.id ? { ...d, placed: true } : d,
        );
        setCurrentDice(updatedDice);
        setPlacedDice([...placedDice, { ...die, position }]);
        setGameHistory([
            ...gameHistory,
            {
                action: "place",
                die,
                position,
                previousGrid: rocketGrid,
                previousHeight: rocketHeight,
                previousBoosterLocked: boosterRowLocked,
            },
        ]);
        return true;
    };

    const sendToFire = (die) => {
        const updatedDice = currentDice.map((d) =>
            d.id === die.id ? { ...d, placed: true } : d,
        );
        setCurrentDice(updatedDice);
        const newFirePile = firePile + 1;
        setFirePile(newFirePile);
        setFireDice((prevFireDice) => [...prevFireDice, die]);
        if (newFirePile >= 5) {
            setGameState("results");
            return;
        }
        setGameHistory([
            ...gameHistory,
            {
                action: "fire",
                die,
                previousFirePile: firePile,
            },
        ]);
    };

    const undoLastMove = () => {
        if (gameHistory.length === 0) return;
        const lastAction = gameHistory[gameHistory.length - 1];
        if (lastAction.action === "place") {
            setRocketGrid(lastAction.previousGrid);
            setRocketHeight(lastAction.previousHeight);
            setBoosterRowLocked(lastAction.previousBoosterLocked);
            const updatedDice = currentDice.map((d) =>
                d.id === lastAction.die.id ? { ...d, placed: false } : d,
            );
            setCurrentDice(updatedDice);
            setPlacedDice(placedDice.filter((d) => d.id !== lastAction.die.id));
        } else if (lastAction.action === "fire") {
            setFirePile(lastAction.previousFirePile);
            const updatedDice = currentDice.map((d) =>
                d.id === lastAction.die.id ? { ...d, placed: false } : d,
            );
            setCurrentDice(updatedDice);
        }
        setGameHistory(gameHistory.slice(0, -1));
    };

    const nextPlayer = () => {
        const unplacedDice = currentDice.filter((d) => !d.placed);
        const totalDice = currentDice.length;
        if (unplacedDice.length === totalDice) {
            alert(
                "You must place at least one die or send unused dice to the fire pile.",
            );
            return;
        }
        const remainingDiceCount = unplacedDice.length;
        const updatedPlayers = players.map((player, index) => {
            if (index === currentPlayerIndex) {
                return { ...player, diceCount: remainingDiceCount };
            }
            return player;
        });
        setPlayers(updatedPlayers);
        if (firePile >= 5) {
            setGameState("results");
            return;
        }
        if (players.length === 1) {
            setTimeout(() => {
                rollDiceForCurrentPlayer(updatedPlayers);
            }, 100);
            return;
        }
        let nextIndex = (currentPlayerIndex + 1) % players.length;
        let attempts = 0;
        while (
            updatedPlayers[nextIndex].diceCount === 0 &&
            attempts < players.length
        ) {
            nextIndex = (nextIndex + 1) % players.length;
            attempts++;
        }
        if (
            attempts >= players.length ||
            updatedPlayers.every((p) => p.diceCount === 0)
        ) {
            setTimeout(() => {
                checkVictoryConditions();
            }, 100);
            return;
        }
        setCurrentPlayerIndex(nextIndex);
    };

    const checkVictoryConditions = () => {
        if (!window.GameLogic || !window.GameLogic.calculateVictoryLevel) {
            return;
        }
        const { calculateVictoryLevel } = window.GameLogic;
        const victoryLevel = calculateVictoryLevel(
            rocketGrid,
            rocketHeight,
            boosterRowLocked,
        );
        if (victoryLevel > 0) {
            setGameState("results");
        } else {
            setCurrentDice([]);
            setPlacedDice([]);
            setGameHistory([]);
            setTimeout(() => {
                rollDiceForCurrentPlayer();
            }, 100);
        }
    };

    /* ─────────────────── Launch logic: must have full body above boosters ─────────────────── */
    const canLaunch = () => {
        // Must have at least one 6 (booster)
        const boosters = Object.values(rocketGrid).filter(
            (d) => d && d.value === 6,
        );
        if (!boosters.length) return false;

        // Find the booster row (lowest row with a 6)
        const boosterRow = boosters.length
            ? Math.min(
                  ...Object.keys(rocketGrid)
                      .filter((k) => rocketGrid[k] && rocketGrid[k].value === 6)
                      .map((k) => parseInt(k.split("-")[0])),
              )
            : null;
        if (!boosterRow) return false;

        // All rows above booster row must be 100% filled
        for (let row = 1; row < boosterRow; row++) {
            for (let col = 1; col <= row; col++) {
                if (!rocketGrid[`${row}-${col}`]) return false;
            }
        }
        return true;
    };

    const attemptLaunch = () => {
        const boosters = Object.entries(rocketGrid).filter(
            ([, d]) => d && d.value === 6,
        );
        if (!boosters.length) {
            alert(
                "No boosters found! You need at least one booster to launch.",
            );
            return;
        }
        const boosterRolls = boosters.map(
            () => Math.floor(Math.random() * 6) + 1,
        );
        const hasSuccessfulBooster = boosterRolls.some((roll) => roll === 6);
        if (hasSuccessfulBooster) {
            alert(`Launch SUCCESS! Booster rolls: ${boosterRolls.join(", ")}.`);
            setGameState("results");
        } else {
            const newGrid = { ...rocketGrid };
            boosters.forEach(([pos], i) => {
                if (i === 0) {
                    setFireDice((fireDice) => [...fireDice, rocketGrid[pos]]);
                    setFirePile((pile) => pile + 1);
                }
                newGrid[pos] = null;
            });
            setRocketGrid(newGrid);
            setBoosterRowLocked(false);
            alert(
                `Launch failed! Booster rolls: ${boosterRolls.join(", ")}. Need at least one 6. One booster added to fire, continue playing.`,
            );
            if (firePile + 1 >= 5) {
                setGameState("results");
            }
        }
    };

    const resetGame = () => {
        setGameState("setup");
        setPlayers([]);
        setCurrentPlayerIndex(0);
        setRocketGrid({});
        setFirePile(0);
        setCurrentDice([]);
        setPlacedDice([]);
        setGameHistory([]);
        setRocketHeight(0);
        setBoosterRowLocked(false);
        setFireDice([]);
        const grid = {};
        for (let row = 1; row <= 6; row++) {
            for (let col = 1; col <= row; col++) {
                grid[`${row}-${col}`] = null;
            }
        }
        setRocketGrid(grid);
    };

    const selectDie = (die) => {
        if (die.placed) return;
        
        // If clicking the same die, deselect it
        if (selectedDie && selectedDie.id === die.id) {
            setSelectedDie(null);
        } else {
            setSelectedDie(die);
        }
    };

    const placeSelectedDie = (position) => {
        if (!selectedDie) return false;
        
        const success = placeDie(selectedDie, position);
        if (success) {
            setSelectedDie(null); // Clear selection after successful placement
        }
        return success;
    };

    const sendSelectedToFire = () => {
        if (!selectedDie) return false;
        
        sendToFire(selectedDie);
        setSelectedDie(null); // Clear selection after sending to fire
        return true;
    };

    window.sendToFire = sendToFire;
    window.dropDieOnGrid = placeDie;
    window.attemptLaunch = attemptLaunch;
    window.canLaunch = canLaunch;
    window.currentRocketGrid = rocketGrid;
    window.currentRocketHeight = rocketHeight;
    window.currentBoosterRowLocked = boosterRowLocked;
    window.setShowLaunchHelper = setShowLaunchHelper;
    window.selectDie = selectDie;
    window.selectedDie = selectedDie;
    window.placeSelectedDie = placeSelectedDie;

    return (
        <div className="app">
            {/* LAUNCH HELPER DIALOG */}
            {showLaunchHelper && (
                <div
                    style={{
                        background: "#fff9cd",
                        border: "2px solid #f4d35e",
                        padding: "16px 20px",
                        borderRadius: "12px",
                        position: "absolute",
                        top: "32%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 99,
                        textAlign: "center",
                        fontWeight: "bold",
                        maxWidth: 320,
                    }}
                >
                    🚀 Finish your rocket body before launching!
                    <div>
                        <button
                            style={{ marginTop: 10 }}
                            className="btn btn-primary"
                            onClick={() => setShowLaunchHelper(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* YOUR EXISTING UI, for example: */}
            {gameState === "welcome" && (
                <div className="welcome-screen">
                    <div className="welcome-icon">🚀</div>
                    <h1 className="welcome-title">Liftoff</h1>
                    <p className="welcome-subtitle">
                        Build rockets with dice and reach for the stars!
                    </p>
                    <button
                        className="btn btn-primary btn-large"
                        onClick={() => setGameState("setup")}
                    >
                        Play
                    </button>
                    <div className="welcome-date">
                        {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            )}

            {gameState === "setup" && (
                <>
                    <div className="top-nav">
                        <button
                            className="nav-back"
                            onClick={() => setGameState("welcome")}
                        >
                            ←
                        </button>
                        <span className="nav-title">Liftoff</span>
                        <div className="nav-actions">
                            <button className="nav-icon">?</button>
                            <button className="nav-icon">⚙️</button>
                        </div>
                    </div>
                    <GameSetup onStartGame={startGame} />
                </>
            )}

            {gameState === "playing" && (
                <>
                    <div className="game-container">
                        <div className="top-status">
                            <button
                                className="nav-back-inline"
                                onClick={() => setGameState("setup")}
                            >
                                ←
                            </button>
                            <div className="players-compact">
                                {players.map((player, index) => (
                                    <div
                                        key={player.name || index}
                                        className={`player-compact ${
                                            index === currentPlayerIndex
                                                ? "current"
                                                : ""
                                        } ${player.diceCount === 0 ? "eliminated" : ""}`}
                                    >
                                        <div className="player-name-short">
                                            {player.name.startsWith("Player ")
                                                ? `P${index + 1}`
                                                : player.name.length <= 3
                                                  ? player.name
                                                  : player.name.substring(0, 3)}
                                        </div>
                                        <div className="dice-count-small">
                                            {player.diceCount}🎲
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="fire-status">
                            <div
                                className="fire-display fire-drop-zone"
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = "move";
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    try {
                                        const dieData = JSON.parse(
                                            e.dataTransfer.getData(
                                                "text/plain",
                                            ),
                                        );
                                        sendToFire(dieData);
                                    } catch (error) {
                                        console.error(
                                            "Error dropping die to fire:",
                                            error,
                                        );
                                    }
                                }}
                                onClick={sendSelectedToFire}
                            >
                                <span className="fire-label">Fire:</span>
                                <div className="fire-dice-container">
                                    {fireDice.map((die, index) => (
                                        <Die
                                            key={die.id}
                                            die={{ ...die, inFire: true }}
                                            className="fire-die-small"
                                        />
                                    ))}
                                    {Array.from(
                                        { length: 5 - firePile },
                                        (_, i) => (
                                            <div
                                                key={`empty-${i}`}
                                                className="fire-slot-empty"
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="game-board">
                            <div className="rocket-section">
                                <RocketGrid
                                    grid={rocketGrid}
                                    onDropDie={placeDie}
                                    rocketHeight={rocketHeight}
                                    boosterRowLocked={boosterRowLocked}
                                    currentDice={currentDice}
                                />
                            </div>

                            <DiceRoll
                                dice={currentDice}
                                onDragStart={(die) => die}
                            />

                            <div className="game-controls">
                                <button
                                    onClick={undoLastMove}
                                    disabled={gameHistory.length === 0}
                                    className="btn btn-secondary"
                                >
                                    Undo
                                </button>
                                <button
                                    onClick={nextPlayer}
                                    className="btn btn-primary"
                                >
                                    Next Player →
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {gameState === "results" && (
                <GameResults
                    rocketGrid={rocketGrid}
                    firePile={firePile}
                    rocketHeight={rocketHeight}
                    boosterRowLocked={boosterRowLocked}
                    onRestart={resetGame}
                />
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
