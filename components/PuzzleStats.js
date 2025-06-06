import { useEffect, useState } from "react";

export default function PuzzleStats() {
  const [stats, setStats] = useState({ played: 0, wins: 0, streak: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("puzzleStats");
    if (stored) setStats(JSON.parse(stored));
  }, []);

  return (
    <div className="p-4 text-center space-y-2">
      <div>Games Played: {stats.played}</div>
      <div>Wins: {stats.wins}</div>
      <div>Current Streak: {stats.streak}</div>
    </div>
  );
}
