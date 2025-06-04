import { useState, useEffect } from 'react';
import GameLogic from '../lib/gameLogic';
import Die from '../components/Die';
import DiceRoll from '../components/DiceRoll';
import RocketGrid from '../components/RocketGrid';
import GameSetup from '../components/GameSetup';
import GameResults from '../components/GameResults';
import IntroSequence from '../components/IntroSequence';
import GameModal from '../components/GameModal';
import { Star, Flame, X, CheckCircle, AlertTriangle, Rocket } from 'lucide-react';
import Head from "next/head";
import LaunchResults from '../components/LaunchResults';

export default function Home() {
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
    const [stars, setStars] = useState([]);
    
    // Modal state
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        data: null
    });

    const showModal = (type, title, message, data = null) => {
        setModal({
            isOpen: true,
            type,
            title,
            message,
            data
        });
    };

    const closeModal = () => {
        setModal({
            isOpen: false,
            type: 'info',
            title: '',
            message: '',
            data: null
        });
    };

    useEffect(() => {
        const grid = {};
        for (let row = 1; row <= 5; row++) {
            for (let col = 1; col <= row; col++) {
                const pos = `${row}-${col}`;
                grid[pos] = null;
            }
        }
        setRocketGrid(grid);
    }, []);

    // Generate stars on client-side only to avoid hydration mismatch
    useEffect(() => {
        const generatedStars = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2,
            size: Math.random() > 0.6 ? 'large' : 'small'
        }));
        setStars(generatedStars);
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
        setCurrentPlayerIndex(0);
        setGameState("intro");
        rollDiceForCurrentPlayer(playerData);
    };

    const rollDiceForCurrentPlayer = (playerData = players) => {
        if (!playerData || playerData.length === 0) return;
        const currentPlayer = playerData[currentPlayerIndex];
        if (!currentPlayer) return;
        setCurrentDice([]);
        setPlacedDice([]);
        setGameHistory([]);
        setSelectedDie(null); // Clear selection when rolling new dice
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
        const isValid = GameLogic.isValidPlacement(
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
            setFireDice(fireDice.filter((d) => d.id !== lastAction.die.id));
        }
        setGameHistory(gameHistory.slice(0, -1));
    };

    const nextPlayer = () => {
        const unplacedDice = currentDice.filter((d) => !d.placed);
        const totalDice = currentDice.length;
        if (unplacedDice.length === totalDice) {
            showModal(
                'warning',
                'Action Required',
                'You must place at least one die onto the ⚙️ Rocket Body (1-5) or use it as 🔋 a Booster (6), or send one die to the fire 🔥.'
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
        // SINGLE PLAYER FIX: If only one player, just re-roll their dice for the next turn
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
        const victoryLevel = GameLogic.calculateVictoryLevel(
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
        if (!canLaunch()) {
            showModal(
                'warning',
                'Launch Not Ready',
                'Complete your rocket body first! All rows above your boosters must be filled before launch.'
            );
            return;
        }
        
        const boosters = Object.entries(rocketGrid).filter(
            ([, d]) => d && d.value === 6,
        );
        if (!boosters.length) {
            showModal(
                'error',
                'Launch Failed',
                'No boosters found! You need at least one booster to launch.'
            );
            return;
        }
        const boosterRolls = boosters.map(
            () => Math.floor(Math.random() * 6) + 1,
        );
        const hasSuccessfulBooster = boosterRolls.some((roll) => roll === 6);
        if (hasSuccessfulBooster) {
            showModal(
                'launch',
                'LIFTOFF!!!',
                'Your rocket travels upward into the glorious cosmos!',
                { boosterRolls, success: true }
            );
            setTimeout(() => {
                setGameState("results");
            }, 4000);
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
            showModal(
                'launch',
                '💨 FIZZLE! FAIL! 💥',
                'Your boosters wheezed like a deflating balloon! No sixes means no flight. Your rocket remains earthbound like a very expensive paperweight.',
                { boosterRolls, success: false }
            );
            if (firePile + 1 >= 5) {
                setTimeout(() => {
                    setGameState("results");
                }, 3000);
            }
        }
    };

    const resetGame = () => {
        // Clear ALL game state
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
        setSelectedDie(null);
        setShowLaunchHelper(false);
        
        // Close any open modals
        closeModal();
        
        // Reset the rocket grid to empty
        const grid = {};
        for (let row = 1; row <= 5; row++) {
            for (let col = 1; col <= row; col++) {
                const pos = `${row}-${col}`;
                grid[pos] = null;
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

    // Handle mobile fire drop events
    useEffect(() => {
        const handleMobileFireDrop = (e) => {
            if (e.detail && e.detail.die) {
                sendToFire(e.detail.die);
            }
        };

        // Add event listener to fire drop zone
        const fireDropZone = document.querySelector('.fire-drop-zone');
        if (fireDropZone) {
            fireDropZone.addEventListener('fireDropMobile', handleMobileFireDrop);
        }

        return () => {
            // Cleanup
            if (fireDropZone) {
                fireDropZone.removeEventListener('fireDropMobile', handleMobileFireDrop);
            }
        };
    }, [firePile]); // Re-run when fire pile changes

    // Starry Background Component
    const StarryBackground = () => (
        <div className="absolute inset-0 overflow-hidden">
            {/* Small varied stars */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute animate-pulse"
                    style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                        opacity: star.size === 'large' ? 0.8 : 0.4
                    }}
                >
                    {star.size === 'large' ? (
                        <Star 
                            size={10} 
                            className="text-white fill-white"
                        />
                    ) : (
                        <div 
                            className="bg-white rounded-full"
                            style={{
                                width: '2px',
                                height: '2px'
                            }}
                        />
                    )}
                </div>
            ))}
            
            {/* Custom SVG Planets with rotation */}
            {/* Saturn */}
            <div 
                className="absolute top-1/4 left-1/6 animate-spin opacity-30" 
                style={{ animationDuration: '20s' }}
            >
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-orange-300">
                    <circle cx="20" cy="20" r="12" fill="currentColor" />
                    <ellipse cx="20" cy="20" rx="18" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
                    <ellipse cx="20" cy="20" rx="16" ry="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                </svg>
            </div>
            
            {/* Earth */}
            <div 
                className="absolute top-3/4 right-1/4 animate-spin opacity-25" 
                style={{ animationDuration: '25s' }}
            >
                <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-400">
                    <circle cx="16" cy="16" r="12" fill="currentColor" />
                    <path d="M8 12 Q12 8 16 12 Q20 8 24 12 Q20 16 16 20 Q12 16 8 12" fill="rgba(34, 197, 94, 0.8)" />
                    <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                </svg>
            </div>
            
            {/* Mars */}
            <div 
                className="absolute top-1/2 right-1/6 animate-spin opacity-20" 
                style={{ animationDuration: '30s' }}
            >
                <svg width="28" height="28" viewBox="0 0 28 28" className="text-red-400">
                    <circle cx="14" cy="14" r="10" fill="currentColor" />
                    <circle cx="10" cy="10" r="2" fill="rgba(139, 69, 19, 0.6)" />
                    <circle cx="18" cy="16" r="1.5" fill="rgba(139, 69, 19, 0.6)" />
                    <circle cx="12" cy="18" r="1" fill="rgba(139, 69, 19, 0.6)" />
                </svg>
            </div>
            
            {/* Jupiter */}
            <div 
                className="absolute top-1/6 right-1/3 animate-spin opacity-15" 
                style={{ animationDuration: '35s' }}
            >
                <svg width="45" height="45" viewBox="0 0 45 45" className="text-yellow-500">
                    <circle cx="22.5" cy="22.5" r="18" fill="currentColor" />
                    <ellipse cx="22.5" cy="18" rx="16" ry="2" fill="rgba(255, 165, 0, 0.8)" />
                    <ellipse cx="22.5" cy="22.5" rx="15" ry="1.5" fill="rgba(255, 140, 0, 0.8)" />
                    <ellipse cx="22.5" cy="27" rx="14" ry="2" fill="rgba(255, 165, 0, 0.8)" />
                    <circle cx="18" cy="20" r="1.5" fill="rgba(139, 69, 19, 0.6)" />
                </svg>
            </div>
            
            {/* Moon */}
            <div 
                className="absolute top-2/3 left-1/3 animate-spin opacity-35" 
                style={{ animationDuration: '15s' }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-300">
                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                    <circle cx="8" cy="8" r="1.5" fill="rgba(156, 163, 175, 0.6)" />
                    <circle cx="16" cy="10" r="1" fill="rgba(156, 163, 175, 0.6)" />
                    <circle cx="10" cy="16" r="0.8" fill="rgba(156, 163, 175, 0.6)" />
                    <circle cx="14" cy="16" r="1.2" fill="rgba(156, 163, 175, 0.6)" />
                </svg>
            </div>
        </div>
    );

    return (
        <div className="app">
            <Head>
                <title>Liftoff</title>
            </Head>
            
            {/* Game Modal */}
            <GameModal 
                isOpen={modal.isOpen}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
            >
                {modal.data && modal.data.boosterRolls && (
                    <LaunchResults 
                        boosterRolls={modal.data.boosterRolls}
                        success={modal.data.success}
                    />
                )}
            </GameModal>
            
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

            {gameState === "welcome" && (
                <div className="welcome-screen">
                    <StarryBackground />
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="welcome-icon mb-8">
                            <svg 
                                width="120" 
                                height="120" 
                                viewBox="0 0 100 100" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-white drop-shadow-lg"
                            >
                                {/* Rocket body */}
                                <path 
                                    d="M50 10 L62 25 L62 70 L55 80 L45 80 L38 70 L38 25 Z" 
                                    stroke="currentColor" 
                                    strokeWidth="2.5" 
                                    fill="none"
                                />
                                {/* Rocket tip */}
                                <path 
                                    d="M38 25 L50 10 L62 25" 
                                    stroke="currentColor" 
                                    strokeWidth="2.5" 
                                    fill="none"
                                />
                                {/* Window */}
                                <circle 
                                    cx="50" 
                                    cy="35" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="2.5" 
                                    fill="none"
                                />
                                {/* Window inner */}
                                <circle 
                                    cx="50" 
                                    cy="35" 
                                    r="6" 
                                    stroke="currentColor" 
                                    strokeWidth="1.5" 
                                    fill="none"
                                    opacity="0.6"
                                />
                                {/* Body details */}
                                <line 
                                    x1="42" y1="50" 
                                    x2="58" y2="50" 
                                    stroke="currentColor" 
                                    strokeWidth="1.5"
                                    opacity="0.7"
                                />
                                <line 
                                    x1="42" y1="60" 
                                    x2="58" y2="60" 
                                    stroke="currentColor" 
                                    strokeWidth="1.5"
                                    opacity="0.7"
                                />
                                {/* Fins */}
                                <path 
                                    d="M38 70 L28 85 L33 85 L38 75" 
                                    stroke="currentColor" 
                                    strokeWidth="2.5" 
                                    fill="none"
                                />
                                <path 
                                    d="M62 70 L72 85 L67 85 L62 75" 
                                    stroke="currentColor" 
                                    strokeWidth="2.5" 
                                    fill="none"
                                />
                                {/* Flame */}
                                <path 
                                    d="M45 80 L47 92 L50 87 L53 92 L55 80" 
                                    stroke="#FFA500" 
                                    strokeWidth="2.5" 
                                    fill="none"
                                    className="animate-pulse"
                                />
                                <path 
                                    d="M47 85 L48 90 L50 88 L52 90 L53 85" 
                                    stroke="#FF6B35" 
                                    strokeWidth="2" 
                                    fill="none"
                                    className="animate-pulse"
                                    style={{ animationDelay: '0.3s' }}
                                />
                            </svg>
                        </div>
                        <h1 
                            className="welcome-title mb-4" 
                            style={{ 
                                fontFamily: '"Courier New", "SF Mono", "Monaco", "Menlo", monospace',
                                fontWeight: 'bold',
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase',
                                fontSize: '3.5rem',
                                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            Liftoff
                        </h1>
                        <p className="welcome-subtitle mb-6">
                            Build. Boost. Blast or BOOM!
                        </p>
                        <p 
                            className="welcome-subtitle mb-4 opacity-90"
                            style={{ fontSize: '14px' }}
                        >
                            How far can you fly?
                        </p>
                        <button
                            className="btn btn-primary btn-large mb-6 text-white border-none transition-all duration-300"
                            style={{ 
                                backgroundColor: '#f97316', 
                                border: 'none' 
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#db7127'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
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
                </div>
            )}

            {gameState === "setup" && (
                <div className="fixed inset-0 bg-black">
                    <StarryBackground />
                    <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                        <GameSetup 
                            onStartGame={startGame} 
                            onBack={() => setGameState("welcome")}
                        />
                    </div>
                </div>
            )}

            {gameState === "intro" && (
                <IntroSequence 
                    onComplete={() => setGameState("playing")}
                    stars={stars}
                />
            )}

            {gameState === "playing" && (
                <>
                    <div className="game-container">
                        <div className="top-status">
                            <button
                                className="nav-back-inline"
                                onClick={resetGame}
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
                                className={`fire-display fire-drop-zone ${selectedDie ? 'valid-for-selected' : ''}`}
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
                                        <div
                                            key={die.id}
                                            className={`fire-flame fire-flame-${index + 1}`}
                                        >
                                            <Flame
                                                size={24}
                                                className="flame-icon"
                                            />
                                        </div>
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
                                    selectedDie={selectedDie}
                                    onPlaceSelectedDie={placeSelectedDie}
                                    onCanLaunch={canLaunch}
                                    onAttemptLaunch={attemptLaunch}
                                    onSetShowLaunchHelper={setShowLaunchHelper}
                                />
                            </div>

                            <DiceRoll
                                dice={currentDice}
                                selectedDie={selectedDie}
                                onSelectDie={selectDie}
                                rocketGrid={rocketGrid}
                                rocketHeight={rocketHeight}
                                boosterRowLocked={boosterRowLocked}
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