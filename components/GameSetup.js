import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import {
  Rocket,
  Info,
  Flame,
  AlertTriangle,
  Sparkles,
  Bomb,
  ArrowLeft,
  HelpCircle,
  Settings as SettingsIcon,
  BookOpenText,
  Zap,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

function GameSetup({ onStartGame, onBack, preservedPlayerSetup }) {
  const [playerCount, setPlayerCount] = useState(8);
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", diceCount: 4 },
    { id: 2, name: "Player 2", diceCount: 2 },
    { id: 3, name: "Player 3", diceCount: 4 },
    { id: 4, name: "Player 4", diceCount: 2 },
    { id: 5, name: "Player 5", diceCount: 3 },
    { id: 6, name: "Player 6", diceCount: 6 },
    { id: 7, name: "Player 7", diceCount: 3 },
    { id: 8, name: "Player 8", diceCount: 2 }
  ]);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showTldrRules, setShowTldrRules] = useState(false);
  const [hasLoadedPreservedSetup, setHasLoadedPreservedSetup] = useState(false);
  const { toast } = useToast();

  // Load any saved setup from localStorage if no preserved setup provided
  useEffect(() => {
    if ((preservedPlayerSetup?.length || 0) > 0 || hasLoadedPreservedSetup) return;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('playerSetup') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlayerCount(parsed.length);
          setPlayers(parsed.map((p, i) => ({ id: p.id || Date.now() + i, ...p })));
          setHasLoadedPreservedSetup(true);
        }
      } catch (err) {
        console.error('Failed to load player setup from localStorage', err);
      }
    }
  }, [preservedPlayerSetup, hasLoadedPreservedSetup]);

  // Persist player setup whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('playerSetup', JSON.stringify(players));
      } catch (err) {
        console.error('Failed to save player setup', err);
      }
    }
  }, [players]);

  // Initialize with preserved setup if available
  useEffect(() => {
    if (preservedPlayerSetup && preservedPlayerSetup.length > 0 && !hasLoadedPreservedSetup) {
      console.log('Loading preserved player setup:', preservedPlayerSetup);
      setPlayerCount(preservedPlayerSetup.length);
      setPlayers(preservedPlayerSetup.map(player => ({
        ...player,
        id: player.id || Date.now() + Math.random() // Ensure unique IDs
      })));
      setHasLoadedPreservedSetup(true);
    }
  }, [preservedPlayerSetup, hasLoadedPreservedSetup]);

  useEffect(() => {
    // Don't auto-generate if we have preserved setup or if we just loaded it
    if (hasLoadedPreservedSetup || (preservedPlayerSetup && preservedPlayerSetup.length > 0)) {
      return;
    }
    
    const newPlayersList = Array.from({ length: playerCount }, (_, i) => {
      if (players[i]) {
        return players[i];
      }
      
      // Default dice counts: 4 players with 2 dice, 3 with 3 dice, 1 with 4 dice
      let defaultDiceCount = 2;
      if (i >= 4 && i <= 6) {
        defaultDiceCount = 3;
      } else if (i === 7) {
        defaultDiceCount = 4;
      }
      
      return {
        id: Date.now() + i,
        name: `Player ${i + 1}`,
        diceCount: defaultDiceCount,
      };
    });
    setPlayers(newPlayersList);
  }, [playerCount, hasLoadedPreservedSetup, preservedPlayerSetup]);

  const updatePlayer = (index, field, value) => {
    const newPlayers = players.map((player, i) => {
      if (i === index) {
        if (field === "diceCount") {
          // Allow empty string for backspacing, but convert to number for validation
          if (value === "" || value === null || value === undefined) {
            return { ...player, [field]: "" };
          }
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return player; // Don't update if not a valid number
          }
          const processedValue = Math.max(1, Math.min(20, numValue));
          return { ...player, [field]: processedValue };
        } else {
          return { ...player, [field]: value };
        }
      }
      return player;
    });
    setPlayers(newPlayers);
  };

  const handlePlayerCountChange = (newCount) => {
    setPlayerCount(newCount);
    // If manually changing player count, reset the preserved setup flag
    setHasLoadedPreservedSetup(false);
  };

  const handleAttemptStartMission = () => {
    setError(null);
    const hasValidPlayers = players.every((p) => p.name.trim() !== "" && p.diceCount >= 1 && p.diceCount <= 20 && p.diceCount !== "");

    if (!hasValidPlayers) {
      const errorMessage = "Every player needs a name and 1-20 dice.";
      setError(errorMessage);
      toast({
        title: "Hold Up!",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
    setShowTldrRules(false);
    setIsDrawerOpen(true);
  };

  const handleConfirmAndStartGame = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('playerSetup', JSON.stringify(players));
      } catch (err) {
        console.error('Failed to save player setup', err);
      }
    }
    onStartGame(players);
    setIsDrawerOpen(false);
    toast({
      title: "Engines Primed!",
      description: `Liftoff sequence initiated for ${players.length} player(s).`,
      variant: "default",
      duration: 4000,
    });
  };

  const handleOpenRulesDrawer = () => {
    setShowTldrRules(false);
    setIsDrawerOpen(true);
  };

  // Use the exported functions to avoid duplication
  const renderDetailedRulesLocal = renderDetailedRules;
  const renderTldrRulesLocal = renderTldrRules;

  return (
    <div className="w-full max-w-md mx-auto bg-card dark:bg-slate-800 rounded-lg shadow-xl mt-4">
      <div className="flex items-center justify-between p-3 border-b dark:border-slate-700">
        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 
          className="text-xl font-semibold text-slate-800 dark:text-slate-100"
          style={{
            fontFamily: '"Courier New", "SF Mono", "Monaco", "Menlo", monospace',
            fontWeight: 'bold',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}
        >
          Liftoff
        </h1>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenRulesDrawer}
            className="text-slate-600 dark:text-slate-400"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">How to Play</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400">
            <SettingsIcon className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>

      <Card className="shadow-none border-none rounded-none">
        <CardContent className="space-y-4 p-4 pt-8">
          {error && (
            <Alert variant="destructive" className="mb-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="player-count" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              Number of Players (1-8):
            </Label>
            <Select value={String(playerCount)} onValueChange={(value) => handlePlayerCountChange(Number(value))}>
              <SelectTrigger id="player-count" className="w-full text-sm">
                <SelectValue placeholder="Select number of players" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={String(num)} className="text-sm">
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Configure Players</h3>
            <div className="space-y-2 max-h-[calc(100vh-400px)] min-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
              {players.map((player, index) => (
                <div key={player.id} className="p-3 border rounded-md bg-slate-50 dark:bg-slate-700/60">
                  <div className="flex space-x-3">
                    <div className="flex-grow">
                      <Label
                        htmlFor={`player-${index}-name`}
                        className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5 block"
                      >
                        Name:
                      </Label>
                      <Input
                        id={`player-${index}-name`}
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayer(index, "name", e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="text-sm h-9 dark:bg-slate-600 dark:border-slate-500"
                      />
                    </div>
                    <div className="w-20 flex-shrink-0">
                      <Label
                        htmlFor={`player-${index}-dice`}
                        className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5 block"
                      >
                        Dice:
                      </Label>
                      <Input
                        id={`player-${index}-dice`}
                        type="number"
                        min="1"
                        max="20"
                        value={player.diceCount}
                        onChange={(e) => updatePlayer(index, "diceCount", e.target.value)}
                        className="text-sm h-9 dark:bg-slate-600 dark:border-slate-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <Button
            size="lg"
            onClick={handleAttemptStartMission}
            className="w-full text-base font-semibold bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
          >
            Start Mission <Rocket className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent 
          className="dark:bg-slate-800" 
          style={{ maxWidth: '500px', margin: '0 auto' }}
        >
          <DrawerHeader className="text-left pt-4 pb-2">
            <div className="flex justify-between items-center">
              <DrawerTitle className="text-xl sm:text-2xl flex items-center font-semibold text-slate-800 dark:text-slate-100">
                <Info className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                Top Secret Intel!
              </DrawerTitle>
              <Button variant="outline" size="sm" onClick={() => setShowTldrRules(!showTldrRules)} className="text-xs">
                {showTldrRules ? (
                  <>
                    <BookOpenText className="mr-1.5 h-3.5 w-3.5" /> Show Full Rules
                  </>
                ) : (
                  <>
                    <Zap className="mr-1.5 h-3.5 w-3.5" /> Wait, What?! (TL;DR)
                  </>
                )}
              </Button>
            </div>
            <DrawerDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
              {showTldrRules
                ? "The super-duper short version. No excuses now!"
                : "Read this, or become space dust. Your choice."}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
            {showTldrRules ? renderTldrRulesLocal() : renderDetailedRulesLocal()}
          </div>
          <DrawerFooter className="pt-3 pb-4 border-t dark:border-slate-700 flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              onClick={handleConfirmAndStartGame}
              size="lg"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-slate-50 text-base"
            >
              Let's Build This Rocket! <Rocket className="ml-2 h-5 w-5" />
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                Reviewing Intel (Close)
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default GameSetup;

// Exported help content functions for reuse
export const renderDetailedRules = () => (
  <div className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300 px-1">
    <div>
      <h4 className="font-bold text-lg text-amber-600 dark:text-amber-400 mb-1.5 flex items-center">
        <Sparkles className="inline h-5 w-5 mr-2" /> Your Glorious Goal:
      </h4>
      <p>
        Launch your magnificent (and hopefully not-too-explodey) rocket as far into the cold, uncaring void of space
        as possible. Bigger rocket = bigger bragging rights (and more space snacks). Don't explode. Seriously.
      </p>
    </div>
    <Separator />
    <div>
      <h4 className="font-bold text-lg text-sky-600 dark:text-sky-400 mb-1.5 flex items-center">
        <span className="inline h-5 w-5 mr-2 bg-slate-700 text-white rounded text-xs flex items-center justify-center">6</span> Your Daring Maneuvers (On Your Turn):
      </h4>
      <ul className="list-none pl-1 space-y-2.5">
        <li>
          <strong className="text-sky-700 dark:text-sky-300">1. Shake, Rattle & Roll (Dice):</strong> Unleash the fury
          of ALL your dice! Let 'em fly!
        </li>
        <li>
          <strong className="text-sky-700 dark:text-sky-300">2. Construct-o-Rama (Must Place ≥1 Die):</strong> You {" "}
          <em className="font-semibold">MUST</em> place at least one die. No hoarding, you dice miser! Each new piece
          must smooch an existing part of your glorious contraption (touching sides, not just corners, you cheeky
          rascal).
          <ul className="list-none pl-4 mt-1.5 space-y-1.5 text-xs">
            <li>
              <span className="inline-flex gap-1 mr-2">
                {[1,2,3,4,5].map(n => (
                  <span key={n} className="inline h-3 w-3 bg-green-500 text-white rounded text-xs flex items-center justify-center">{n}</span>
                ))}
              </span>
              <strong>The Main Squeeze (Body Dice 1-5):</strong> Build your rocket's magnificent body{" "}
              <strong className="text-green-600 dark:text-green-400">DOWNWARDS</strong>, row by glorious row (all 1s,
              then all 2s, etc.). Think of it as a reverse skyscraper of pure awesome. The bigger the body, the
              farther you MIGHT go.
            </li>
            <li>
              <span className="inline h-3 w-3 bg-orange-500 text-white rounded text-xs flex items-center justify-center mr-2">6</span>
              <strong>Fiery Bottoms (Booster Dice - 6s):</strong> Slap these bad boys (dice showing a 6) onto the{" "}
              <strong className="text-orange-600 dark:text-orange-400">LOWEST</strong> row of your rocket's body. This
              locks in your rocket's majestic height. Choose wisely, space cadet! Once a booster is on, that body row
              is SET.
            </li>
          </ul>
        </li>
        <li>
          <strong className="text-sky-700 dark:text-sky-300">3. Uh Oh, Space Junk! (Can't Place?):</strong> If you
          can't legally place any dice (sad trombone!), you must sacrifice one poor, innocent die to the dreaded{" "}
          <strong className="text-red-600 dark:text-red-400">"Fire Pile."</strong> It's for the greater good... maybe.
        </li>
      </ul>
    </div>
    <Separator />
    <div>
      <h4 className="font-bold text-lg text-red-600 dark:text-red-400 mb-1.5 flex items-center">
        <Bomb className="inline h-5 w-5 mr-2" /> Impending Doom (Watch Out!):
      </h4>
      <div className="flex items-baseline">
        <Flame className="inline h-4 w-4 mr-1.5 text-red-500 flex-shrink-0" />
        <p className="text-sm">
          <strong>KABOOM! (The Fire Pile):</strong> If the Fire Pile accumulates{" "}
          <span className="font-bold text-xl text-red-700 dark:text-red-500 mx-1">5</span>
          dice, your beautiful creation spectacularly disintegrates into a million tiny, very sad pieces. Game over,
          buttercup. Try not to cry (too much).
        </p>
      </div>
    </div>
    <Separator />
    <div>
      <h4 className="font-bold text-lg text-teal-600 dark:text-teal-400 mb-1.5 flex items-center">
        <Rocket className="inline h-5 w-5 mr-2" /> To Infinity... And Hopefully Not Beyond (Liftoff!):
      </h4>
      <ul className="list-none pl-1 space-y-1.5">
        <li>
          Once your rocket body is a masterpiece of engineering (or at least, looks vaguely rocket-shaped) AND you've
          attached <strong className="text-teal-700 dark:text-teal-300">one or more Boosters</strong>, it's showtime!
        </li>
        <li>
          Roll <em className="font-semibold">ONLY</em> your Booster dice. Nail a 6 on any of them?{" "}
          <strong className="text-xl text-teal-500">WHOOSH!</strong> You've achieved LIFTOFF! You're a star! (The
          other players are probably just space dust now, metaphorically speaking).
        </li>
        <li>
          The more impressive your rocket (especially that body!), the farther you'll travel. Aim for the stars!
        </li>
      </ul>
    </div>
  </div>
);

export const renderTldrRules = () => (
  <div className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 px-1">
    <p className="text-center font-semibold text-amber-600 dark:text-amber-400 text-base">
      <Zap className="inline h-5 w-5 mr-1.5" /> LIFTOFF! TL;DR <Zap className="inline h-5 w-5 ml-1.5" />
    </p>
    <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md space-y-1.5">
      <p>
        <strong>🚀 Goal:</strong> Launch FAR! Don't EXPLODE!
      </p>
      <p>
        <strong>🎲 Turn:</strong>
      </p>
      <ol className="list-decimal list-inside pl-2 space-y-1 text-xs">
        <li>ROLL all your dice.</li>
        <li>
          BUILD ROCKET (Place ≥1 die, must touch existing parts):
          <ul className="list-disc list-outside pl-5 mt-0.5">
            <li>
              <strong>Body (1-5):</strong> Build DOWN. Bigger = Better.
            </li>
            <li>
              <strong>Boosters (6):</strong> Attach to LOWEST body row. Locks height.
            </li>
          </ul>
        </li>
        <li>
          CAN'T PLACE? 1 die to <strong className="text-red-500">Fire Pile</strong>.
        </li>
      </ol>
      <p>
        <strong className="text-red-600 dark:text-red-500">🔥 Danger!</strong> 5 in Fire Pile = KABOOM! (You lose!)
      </p>
      <p>
        <strong className="text-green-600 dark:text-green-400">🛰️ Liftoff!</strong> Complete body + ≥1 Booster. Roll
        Boosters for a 6 = YOU WIN!
      </p>
    </div>
  </div>
);

// Reusable HelpDrawer component for use during gameplay
export function HelpDrawer({ isOpen, onOpenChange, showCloseOnly = false }) {
  const [showTldrRules, setShowTldrRules] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent 
        className="dark:bg-slate-800" 
        style={{ maxWidth: '500px', margin: '0 auto' }}
      >
        <DrawerHeader className="text-left pt-4 pb-2">
          <div className="flex justify-between items-center">
            <DrawerTitle className="text-xl sm:text-2xl flex items-center font-semibold text-slate-800 dark:text-slate-100">
              <Info className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
              How to Play
            </DrawerTitle>
            <Button variant="outline" size="sm" onClick={() => setShowTldrRules(!showTldrRules)} className="text-xs">
              {showTldrRules ? (
                <>
                  <BookOpenText className="mr-1.5 h-3.5 w-3.5" /> Show Full Rules
                </>
              ) : (
                <>
                  <Zap className="mr-1.5 h-3.5 w-3.5" /> Wait, What?! (TL;DR)
                </>
              )}
            </Button>
          </div>
          <DrawerDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
            {showTldrRules
              ? "The super-duper short version. No excuses now!"
              : "Read this, or become space dust. Your choice."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
          {showTldrRules ? renderTldrRules() : renderDetailedRules()}
        </div>
        <DrawerFooter className="pt-3 pb-4 border-t dark:border-slate-700">
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full text-base">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
