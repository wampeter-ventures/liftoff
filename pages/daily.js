import { useEffect, useState } from "react";
import Head from "next/head";
import GameResults from "../components/GameResults";
import RocketGrid from "../components/RocketGrid";
import DiceRoll from "../components/DiceRoll";
import PuzzleStats from "../components/PuzzleStats";
import GameLogic from "../lib/gameLogic";
import { getPuzzleForToday } from "../lib/dailyPuzzles";

export default function Daily() {
  const puzzle = getPuzzleForToday();
  const [started, setStarted] = useState(false);
  const [grid, setGrid] = useState({});
  const [currentDice, setCurrentDice] = useState([]);
  const [placedDice, setPlacedDice] = useState([]);
  const [firePile, setFirePile] = useState(0);
  const [rocketHeight, setRocketHeight] = useState(0);
  const [boosterRowLocked, setBoosterRowLocked] = useState(false);
  const [selectedDie, setSelectedDie] = useState(null);
  const [gameState, setGameState] = useState("idle");

  useEffect(() => {
    const g = {};
    for (let r = 1; r <= 6; r++) {
      for (let c = 1; c <= r; c++) {
        g[`${r}-${c}`] = null;
      }
    }
    setGrid(g);
  }, []);

  useEffect(() => {
    if (!started) return;
    rollDice();
  }, [started]);

  const rollDice = () => {
    const diceResults = [];
    let id = 0;
    Object.entries(puzzle.dice).forEach(([val, count]) => {
      for (let i = 0; i < count; i++) {
        diceResults.push({
          id: `d-${id++}`,
          value: Number(val),
          placed: false,
        });
      }
    });
    setCurrentDice(diceResults);
  };

  const placeDie = (die, pos) => {
    if (!GameLogic.isValidPlacement(pos, die.value, grid, rocketHeight, boosterRowLocked)) return;
    const newGrid = { ...grid };
    newGrid[pos] = { ...die, placed: true };
    setGrid(newGrid);
    if (die.value === 6) setBoosterRowLocked(true);
    else {
      const row = parseInt(pos.split("-")[0]);
      setRocketHeight(Math.max(rocketHeight, row));
    }
    setCurrentDice(currentDice.map(d => d.id === die.id ? { ...d, placed: true } : d));
    setPlacedDice([...placedDice, { ...die, position: pos }]);
  };

  const sendToFire = (die) => {
    setCurrentDice(currentDice.map(d => d.id === die.id ? { ...d, placed: true } : d));
    setFirePile(firePile + 1);
  };

  const canLaunch = () => {
    return GameLogic.calculateVictoryLevel(grid, rocketHeight, boosterRowLocked) > 0;
  };

  const attemptLaunch = () => {
    setGameState("results");
    updateStats(canLaunch());
  };

  const updateStats = (win) => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("puzzleStats");
    const stats = stored ? JSON.parse(stored) : { played: 0, wins: 0, streak: 0 };
    stats.played += 1;
    if (win) {
      stats.wins += 1;
      stats.streak += 1;
    } else {
      stats.streak = 0;
    }
    localStorage.setItem("puzzleStats", JSON.stringify(stats));
  };

  if (gameState === "results") {
    return (
      <div className="p-4">
        <GameResults rocketGrid={grid} firePile={firePile} boosterRowLocked={boosterRowLocked} onRestart={() => window.location.reload()} />
        <PuzzleStats />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="p-4 text-center space-y-4">
        <Head><title>Daily Puzzle</title></Head>
        <h1 className="text-2xl font-bold">Daily Puzzle</h1>
        <img src={puzzle.image} alt="rocket" className="mx-auto" />
        <button className="btn btn-primary" onClick={() => setStarted(true)}>Start Puzzle</button>
        <PuzzleStats />
      </div>
    );
  }

  return (
    <div className="p-4">
      <RocketGrid grid={grid} onDropDie={placeDie} rocketHeight={rocketHeight} boosterRowLocked={boosterRowLocked} currentDice={currentDice} selectedDie={selectedDie} onPlaceSelectedDie={(pos) => placeDie(selectedDie, pos)} />
      <DiceRoll dice={currentDice} selectedDie={selectedDie} onSelectDie={setSelectedDie} />
      <div className="flex justify-between mt-2">
        <button className="btn" onClick={() => attemptLaunch()} disabled={!canLaunch()}>Launch</button>
        <button className="btn" onClick={() => sendToFire(selectedDie)} disabled={!selectedDie}>Fire</button>
      </div>
    </div>
  );
}
