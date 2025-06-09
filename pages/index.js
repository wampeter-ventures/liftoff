import { useState, useEffect, useRef } from 'react';
import GameLogic from '../lib/gameLogic';
import DiceRoll from '../components/DiceRoll';
import RocketGrid from '../components/RocketGrid';
import GameSetup, { HelpDrawer } from '../components/GameSetup';
import GameResults from '../components/GameResults';
import IntroSequence from '../components/IntroSequence';
import GameModal from '../components/GameModal';
import {
    Star,
    Flame,
    HelpCircle,
    Atom,
    Biohazard,
    Shell,
    Radiation,
    Orbit,
    Radar,
    Radio,
    Volleyball,
    Snowflake,
    Zap,
    Bubbles,
    Sparkles,
    CircleGauge,
    Cctv,
    Backpack,
    HeartPulse,
    Candy,
    Gem,
    Lollipop,
    BrainCog,
    LoaderPinwheel,
    AudioLines,
    Rat,
    Bug,
    HardHat,
    Telescope,
    Satellite,
    Globe,
    Moon
} from 'lucide-react';
import Head from 'next/head';
import LaunchResults from '../components/LaunchResults';

export default function Home() {
    const [gameState, setGameState] = useState('welcome');
    const [players, setPlayers] = useState([]);
    const [originalPlayerSetup, setOriginalPlayerSetup] = useState([]);
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
    const [preparingLaunch, setPreparingLaunch] = useState(false);
    const [launchCountdown, setLaunchCountdown] = useState(0);
    const [selectedDie, setSelectedDie] = useState(null);
    const [stars, setStars] = useState([]);
    const [showGameplayHelp, setShowGameplayHelp] = useState(false);
    const [welcomeAnim, setWelcomeAnim] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Confirmation animation state
    const [fireFlash, setFireFlash] = useState(false);
    const [highlightSlot, setHighlightSlot] = useState(null);
    const [showBoosterAnim, setShowBoosterAnim] = useState('');
    const [placementEffect, setPlacementEffect] = useState(null); // { pos, Icon }
    const [wolfLaunchAttempted, setWolfLaunchAttempted] = useState(false);
    const [wolfOutcome, setWolfOutcome] = useState(null);

    const playersContainerRef = useRef(null);
    const playerRefs = useRef([]);

    const placementIcons = [
        Atom,
        Biohazard,
        Shell,
        Radiation,
        Orbit,
        Radar,
        Radio,
        Volleyball,
        Snowflake,
        Zap,
        Bubbles,
        Sparkles,
        CircleGauge,
        Cctv,
        Backpack,
        HeartPulse,
        Candy,
        Gem,
        Lollipop,
        BrainCog,
        LoaderPinwheel,
        AudioLines,
        Rat,
        Bug,
        HardHat,
        Telescope,
        Satellite,
    ];
    const [outOfDiceFail, setOutOfDiceFail] = useState(false);

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

    // Load any saved player setup from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('playerSetup');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setOriginalPlayerSetup(parsed);
                }
            } catch (err) {
                console.error('Failed to parse saved player setup', err);
            }
        }
    }, []);

    useEffect(() => {
        const grid = {};
        for (let row = 1; row <= 6; row++) {
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

    // Preload rocket assets so they're ready when needed
    useEffect(() => {
        if (typeof window === 'undefined') return;
        ['/icon-192.png', '/rocket_big.png'].forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    useEffect(() => {
        if (gameState === 'playing' && players.length > 0) {
            setCurrentDice([]);
            setPlacedDice([]);
            setGameHistory([]);
            setTimeout(() => {
                rollDiceForCurrentPlayer();
            }, 50);
        }
    }, [currentPlayerIndex, gameState]);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const target = playerRefs.current[currentPlayerIndex + 1];
        if (target && playersContainerRef.current) {
            target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, [currentPlayerIndex]);

    useEffect(() => {
        if (!isHydrated) return;
        
        if (welcomeAnim) {
            const timer = setTimeout(() => {
                setGameState('setup');
            }, 2100);
            
            return () => clearTimeout(timer);
        }
    }, [welcomeAnim, isHydrated]);

    const startGame = (playerData) => {
        // Store original player setup for future resets
        setOriginalPlayerSetup(playerData.map(player => ({
            ...player,
            diceCount: player.diceCount // Preserve original dice count
        })));

        // Persist setup so it survives page refreshes
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('playerSetup', JSON.stringify(playerData));
            } catch (err) {
                console.error('Failed to save player setup', err);
            }
        }

        setPlayers(playerData);
        setCurrentPlayerIndex(0);
        setOutOfDiceFail(false);
        setGameState('intro');
        rollDiceForCurrentPlayer(playerData, 0);
    };

    const startWolfLevel = () => {
        clearAllGameState();
        const grid = {};
        for (let row = 1; row <= 5; row++) {
            for (let col = 1; col <= row; col++) {
                grid[`${row}-${col}`] = {
                    id: `prefill-${row}-${col}`,
                    value: col,
                    playerId: 0,
                    playerName: 'Prefill',
                    placed: true,
                };
            }
        }
        for (let col = 1; col <= 6; col++) {
            grid[`6-${col}`] = null;
        }
        setRocketGrid(grid);
        setRocketHeight(5);
        setBoosterRowLocked(false);
        setFirePile(0);
        setFireDice([]);
        setPlayers([{ id: 1, name: 'Eris Explorer', diceCount: 6 }]);
        setCurrentPlayerIndex(0);
        setWolfLaunchAttempted(false);
        setWolfOutcome(null);
        setGameState('wolf');
        setTimeout(
            () => rollDiceForCurrentPlayer([{ id: 1, name: 'Eris Explorer', diceCount: 6 }], 0),
            50,
        );
    };

    const rollDiceForCurrentPlayer = (playerData = players, index = currentPlayerIndex) => {
        if (!playerData || playerData.length === 0) return;
        const currentPlayer = playerData[index];
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

        const wasBoosterLocked = boosterRowLocked;

        const newGrid = { ...rocketGrid };
        newGrid[position] = { ...die, placed: true };
        setRocketGrid(newGrid);

        if (die.value === 6) {
            setBoosterRowLocked(true);
            const boostersAfter = Object.values(newGrid).filter(
                (d) => d && d.value === 6,
            ).length;
            if (gameState === 'wolf') {
                const messages = [
                    'SIGNAL DETECTED: Is that a howl? A moo?!',
                    'SIGNAL DETECTED: Faint whistling\u2014sounds like space karaoke.',
                    'SIGNAL DETECTED: Message fragment: \u201cBRING MORE CHEESE.\u201d',
                    'SIGNAL DETECTED: Interference\u2026 is someone practicing knock-knock jokes?',
                    'SIGNAL DETECTED: Hearing what can only be described as synchronized clapping.',
                    'SIGNAL LOCKED: Transmission reads, \u201cWELCOME, EARTHLINGS! SNACKS REQUIRED.\u201d',
                ];
                const msg = messages[Math.min(boostersAfter, messages.length) - 1];
                setShowBoosterAnim(msg);
                setTimeout(() => setShowBoosterAnim(''), 4000);
            } else if (!wasBoosterLocked) {
                setShowBoosterAnim('\ud83d\udd0b Boosters Online!');
                setTimeout(() => setShowBoosterAnim(''), 4000);
            }
        } else {
            const row = parseInt(position.split('-')[0]);
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
                action: 'place',
                die,
                position,
                previousGrid: rocketGrid,
                previousHeight: rocketHeight,
                previousBoosterLocked: boosterRowLocked,
            },
        ]);
        setHighlightSlot(position);
        const IconComp = placementIcons[Math.floor(Math.random() * placementIcons.length)];
        setPlacementEffect({ pos: position, Icon: IconComp });
        setTimeout(() => {
            setHighlightSlot(null);
            setPlacementEffect(null);
        }, 1200);
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
        setFireFlash(true);
        setTimeout(() => setFireFlash(false), 900);
        if (newFirePile >= 5) {
            setOutOfDiceFail(false);
            setGameState('results');
            return;
        }
        setGameHistory([
            ...gameHistory,
            {
                action: 'fire',
                die,
                previousFirePile: firePile,
            },
        ]);
    };

    const undoLastMove = () => {
        if (gameHistory.length === 0) return;
        const lastAction = gameHistory[gameHistory.length - 1];
        if (lastAction.action === 'place') {
            setRocketGrid(lastAction.previousGrid);
            setRocketHeight(lastAction.previousHeight);
            setBoosterRowLocked(lastAction.previousBoosterLocked);
            const updatedDice = currentDice.map((d) =>
                d.id === lastAction.die.id ? { ...d, placed: false } : d,
            );
            setCurrentDice(updatedDice);
            setPlacedDice(placedDice.filter((d) => d.id !== lastAction.die.id));
        } else if (lastAction.action === 'fire') {
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
                'You must place at least one die onto the ⚙️ Rocket Body (1-6) or use it as 🔋 a Booster (6), or send one die to the fire 🔥.'
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
            setOutOfDiceFail(false);
            setGameState('results');
            return;
        }
        // SINGLE PLAYER FIX: If only one player, just re-roll their dice for the next turn
        if (players.length === 1) {
            setTimeout(() => {
                rollDiceForCurrentPlayer(updatedPlayers, currentPlayerIndex);
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
        if (nextIndex === currentPlayerIndex) {
            setTimeout(() => {
                rollDiceForCurrentPlayer(updatedPlayers, currentPlayerIndex);
            }, 100);
            return;
        }
        setCurrentPlayerIndex(nextIndex);
    };

    const checkVictoryConditions = () => {
        // If the rocket body isn't complete, players ran out of parts mid-build
        if (!canLaunch()) {
            setOutOfDiceFail(true);
            setGameState('results');
            return;
        }

        setOutOfDiceFail(false);
        setGameState('results');
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
                      .map((k) => parseInt(k.split('-')[0])),
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
        setPreparingLaunch(true);
        let count = 5;
        setLaunchCountdown(count);
        const countdown = setInterval(() => {
            count -= 1;
            setLaunchCountdown(count);
            if (count === 0) {
                clearInterval(countdown);
                setPreparingLaunch(false);
                setLaunchCountdown(0);
                if (hasSuccessfulBooster) {
                    showModal(
                        'launch',
                        '🎲 CMON SIXES...',
                        'The fate of your rocket hangs in the balance...',
                        { boosterRolls, success: true }
                    );
                    if (gameState === 'wolf') {
                        setWolfLaunchAttempted(true);
                        setWolfOutcome('success');
                        setTimeout(() => {
                            setGameState('wolf_results');
                        }, 4000);
                    } else {
                        setTimeout(() => {
                            setGameState('results');
                        }, 4000);
                    }
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
                        '🎲 CMON SIXES...',
                        'The fate of your rocket hangs in the balance...',
                        { boosterRolls, success: false }
                    );
                    if (gameState === 'wolf') {
                        setWolfLaunchAttempted(true);
                        setWolfOutcome('fail');
                        setTimeout(() => {
                            setGameState('wolf_results');
                        }, 3000);
                    } else if (firePile + 1 >= 5) {
                        setTimeout(() => {
                            setGameState('results');
                        }, 3000);
                    }
                }
            }
        }, 1000);
    };

    const clearAllGameState = () => {
        // Clear game state variables but preserve original player setup
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
        setHighlightSlot(null);
        setFireFlash(false);
        setShowBoosterAnim('');
        setPlacementEffect(null);
        setLaunchCountdown(0);
        setOutOfDiceFail(false);
        setWelcomeAnim(false); 
    
        // Close any open modals
        closeModal();
    
        // Reset the rocket grid to empty
        const grid = {};
        for (let row = 1; row <= 6; row++) {
            for (let col = 1; col <= row; col++) {
                const pos = `${row}-${col}`;
                grid[pos] = null;
            }
        }
        setRocketGrid(grid);
    };

    const resetGame = () => {
        clearAllGameState();
        setGameState('setup');
    };

    const resetGamePreservingSetup = () => {
        // Clear game state but keep original player setup for replay
        clearAllGameState();
        setGameState('setup');
        // Note: originalPlayerSetup is preserved and will be used by GameSetup
    };

    const goToWelcome = () => {
        console.log('goToWelcome called!');
        console.trace(); // This will show you exactly what called this function
        clearAllGameState();
        setOriginalPlayerSetup([]);
        setWelcomeAnim(false);
        setGameState('welcome');
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

    // Starry Background Component
    const StarryBackground = ({ animateExit = false }) => (
        <div className={`absolute inset-0 overflow-hidden ${animateExit ? 'stars-exit' : ''}`}>
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

            {/* Lucide planets */}
            {[
                { Icon: Orbit, size: 32, duration: 20, className: 'text-orange-300', style: { top: '25%', left: '16%' } },
                { Icon: Globe, size: 28, duration: 25, className: 'text-blue-400', style: { top: '75%', right: '25%' } },
                { Icon: Satellite, size: 24, duration: 30, className: 'text-red-400', style: { top: '50%', right: '16%' } },
                { Icon: Moon, size: 20, duration: 15, className: 'text-gray-300', style: { top: '66%', left: '33%' } },
            ].map(({ Icon, size, duration, className, style }, i) => (
                <div
                    key={`planet-${i}`}
                    className={`absolute animate-spin opacity-30 ${className}`}
                    style={{
                        animationDuration: `${duration}s`,
                        ...style,
                    }}
                >
                    <Icon size={size} />
                </div>
            ))}
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
                        background: '#fff9cd',
                        border: '2px solid #f4d35e',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        position: 'absolute',
                        top: '32%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 99,
                        textAlign: 'center',
                        fontWeight: 'bold',
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

            {gameState === 'welcome' && (
                <div className="welcome-screen">
                    <StarryBackground animateExit={welcomeAnim} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className={`welcome-icon mb-8 ${welcomeAnim ? 'rocket-exit' : ''}`}>
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
                            onClick={() => {
                                setWelcomeAnim(true);
                            }}
                        >
                            Play
                        </button>
                        <div className="welcome-date">
                            {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'setup' && (
                <div className="fixed inset-0 bg-black">
                    <StarryBackground />
                    <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                        <GameSetup
                            onStartGame={startGame}
                            onBack={goToWelcome}
                            preservedPlayerSetup={originalPlayerSetup}
                        />
                    </div>
                </div>
            )}

            {gameState === 'intro' && (
                <IntroSequence
                    onComplete={() => setGameState('playing')}
                    stars={stars}
                />
            )}

            {gameState === 'playing' && (
                <>
                    {/* Gameplay Help Drawer */}
                    <HelpDrawer
                        isOpen={showGameplayHelp}
                        onOpenChange={setShowGameplayHelp}
                    />

                    {launchCountdown > 0 && (
                        <div className="launch-countdown-overlay">
                            {launchCountdown}
                        </div>
                    )}


                    <div className="game-container">
                        <div className="top-status">
                            <button
                                className="nav-back-inline"
                                onClick={resetGamePreservingSetup}
                            >
                                &lt;
                            </button>
                            <div className="players-compact-container" ref={playersContainerRef}>
                                <div className="players-compact">
                                    {(() => {
                                        const totalDice = players.reduce((sum, p) => sum + p.diceCount, 0);
                                        return [
                                            (
                                                <div
                                                    key="all-dice"
                                                    ref={(el) => {
                                                        playerRefs.current[0] = el;
                                                    }}
                                                    className="player-compact all-dice"
                                                >
                                                    <div className="player-name-short">All</div>
                                                    <div className="dice-count-small">{totalDice}🎲</div>
                                                </div>
                                            ),
                                            ...players.map((player, index) => (
                                                <div
                                                    key={player.name || index}
                                                    ref={(el) => {
                                                        playerRefs.current[index + 1] = el;
                                                    }}
                                                    className={`player-compact ${
                                                        index === currentPlayerIndex ? 'current' : ''
                                                    } ${player.diceCount === 0 ? 'eliminated' : ''}`}
                                                >
                                                    <div className="player-name-short">
                                                        {player.name.startsWith('Player ')
                                                            ? `P${index + 1}`
                                                            : player.name.length <= 3
                                                              ? player.name
                                                              : player.name.substring(0, 3)}
                                                    </div>
                                                    <div className="dice-count-small">{player.diceCount}🎲</div>
                                                </div>
                                            ))
                                        ];
                                    })()}
                                </div>
                            </div>
                            <button
                                className="nav-back-inline"
                                onClick={() => setShowGameplayHelp(true)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <HelpCircle size={18} />
                            </button>
                        </div>

                        <div className="fire-status">
                            <div
                                className={`fire-display fire-drop-zone ${selectedDie ? 'valid-for-selected' : ''} ${fireFlash ? 'confirm-fire' : ''}`}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = 'move';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    try {
                                        const dieData = JSON.parse(
                                            e.dataTransfer.getData(
                                                'text/plain',
                                            ),
                                        );
                                        sendToFire(dieData);
                                    } catch (error) {
                                        console.error(
                                            'Error dropping die to fire:',
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
                            <div className={`rocket-section ${launchCountdown > 0 ? 'on-top' : ''}`}>
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
                                    highlightSlot={highlightSlot}
                                    showBoosterAnimation={showBoosterAnim}
                                    placementEffect={placementEffect}
                                    preparingLaunch={preparingLaunch}
                                    wolfMode={false}
                                />
                            </div>

                            <DiceRoll
                                dice={currentDice}
                                selectedDie={selectedDie}
                                onSelectDie={selectDie}
                                onDragStart={(e, die) => {
                                    // Enable drag functionality
                                }}
                                rocketGrid={rocketGrid}
                                rocketHeight={rocketHeight}
                                boosterRowLocked={boosterRowLocked}
                            />

                            <div className="game-controls">
                                {boosterRowLocked && !preparingLaunch && (
                                    <button
                                        className={`btn btn-launch ${!canLaunch() ? 'btn-next-disabled' : 'btn-primary'}`}
                                        onClick={() => {
                                            if (canLaunch()) {
                                                attemptLaunch();
                                            } else {
                                                setShowLaunchHelper(true);
                                            }
                                        }}
                                    >
                                        Launch
                                    </button>
                                )}
                                <button
                                    onClick={nextPlayer}
                                    className={`btn btn-primary ${currentDice.every((d) => !d.placed) ? 'btn-next-disabled' : ''}`}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {gameState === 'wolf' && (
                <div className="fixed inset-0 bg-black text-white">
                    <StarryBackground />
                    <div className="relative z-10 pt-4">
                        {/* Gameplay Help Drawer */}
                        <HelpDrawer
                            isOpen={showGameplayHelp}
                            onOpenChange={setShowGameplayHelp}
                        />
                        {launchCountdown > 0 && (
                            <div className="launch-countdown-overlay">{launchCountdown}</div>
                        )}

                        <div className="game-container wolf-mode">
                            <div className="top-status">
                                <button className="nav-back-inline" onClick={resetGamePreservingSetup}>&lt;</button>
                                <div className="players-compact-container" ref={playersContainerRef}>
                                    <div className="players-compact">
                                        <div className="player-compact current">
                                            <div className="player-name-short">YOU</div>
                                            <div className="dice-count-small">{players[0]?.diceCount}🎲</div>
                                        </div>
                                    </div>
                                </div>
                                <button className="nav-back-inline" onClick={() => setShowGameplayHelp(true)} style={{ marginLeft: 'auto' }}>
                                    <HelpCircle size={18} />
                                </button>
                            </div>

                            <div className="fire-status">
                                <div
                                    className={`fire-display fire-drop-zone ${selectedDie ? 'valid-for-selected' : ''} ${fireFlash ? 'confirm-fire' : ''}`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = 'move';
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        try {
                                            const dieData = JSON.parse(
                                                e.dataTransfer.getData('text/plain'),
                                            );
                                            sendToFire(dieData);
                                        } catch (error) {
                                            console.error('Error dropping die to fire:', error);
                                        }
                                    }}
                                    onClick={sendSelectedToFire}
                                >
                                    <span className="fire-label">Fire:</span>
                                    <div className="fire-dice-container">
                                        {fireDice.map((die, index) => (
                                            <div key={die.id} className={`fire-flame fire-flame-${index + 1}`}>
                                                <Flame size={24} className="flame-icon" />
                                            </div>
                                        ))}
                                        {Array.from({ length: 5 - firePile }, (_, i) => (
                                            <div key={`empty-${i}`} className="fire-slot-empty" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="game-board">
                                <div className={`rocket-section ${launchCountdown > 0 ? 'on-top' : ''}`}>
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
                                        highlightSlot={highlightSlot}
                                        showBoosterAnimation={showBoosterAnim}
                                        placementEffect={placementEffect}
                                        preparingLaunch={preparingLaunch}
                                        wolfMode={true}
                                    />
                                </div>

                                <DiceRoll
                                    dice={currentDice}
                                    selectedDie={selectedDie}
                                    onSelectDie={selectDie}
                                    onDragStart={(e, die) => {}}
                                    rocketGrid={rocketGrid}
                                    rocketHeight={rocketHeight}
                                    boosterRowLocked={boosterRowLocked}
                                />

                                <div className="game-controls">
                                    {boosterRowLocked && !preparingLaunch && (
                                        <button
                                            className={`btn btn-launch ${!canLaunch() ? 'btn-next-disabled' : 'btn-primary'}`}
                                            onClick={() => {
                                                if (!wolfLaunchAttempted && canLaunch()) {
                                                    attemptLaunch();
                                                }
                                            }}
                                        >
                                            Launch to Wolf
                                        </button>
                                    )}
                                    <button
                                        onClick={nextPlayer}
                                        className={`btn btn-primary ${currentDice.every((d) => !d.placed) ? 'btn-next-disabled' : ''}`}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'wolf_results' && (
                <GameResults
                    rocketGrid={rocketGrid}
                    firePile={firePile}
                    boosterRowLocked={boosterRowLocked}
                    outOfDiceFail={outOfDiceFail}
                    onRestart={resetGamePreservingSetup}
                    wolfOutcome={wolfOutcome}
                />
            )}

            {gameState === 'results' && (
                <GameResults
                    rocketGrid={rocketGrid}
                    firePile={firePile}
                    boosterRowLocked={boosterRowLocked}
                    outOfDiceFail={outOfDiceFail}
                    onRestart={resetGamePreservingSetup}
                    onWolfStart={startWolfLevel}
                />
            )}
        </div>
    );
}
