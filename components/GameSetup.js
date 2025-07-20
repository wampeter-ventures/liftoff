import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardFooter } from './ui/card';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import StatsDrawer from './StatsDrawer';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';
import {
  Rocket,
  Info,
  Flame,
  AlertTriangle,
  Sparkles,
  Bomb,
  HelpCircle,
  BarChart2,
  BookOpenText,
  Zap,
  Target,
  ListChecks,
  Skull,
  PartyPopper,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  ChevronRight,
} from 'lucide-react';

import { useToast } from '../hooks/use-toast';

function GameSetup({ onStartGame, onBack, preservedPlayerSetup }) {
  const [playerCount, setPlayerCount] = useState(8);
  
  // Temporary: Clear old cached player names to show new company names
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('playerSetup');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Check if it has old "Player X" format names
          if (parsed.some(p => p.name && p.name.startsWith('Player '))) {
            localStorage.removeItem('playerSetup');
            console.log('Cleared old player setup to use new company names');
          }
        } catch (err) {
          console.error('Error checking player setup', err);
        }
      }
    }
  }, []);
  
  // Fun space company names for default players
  const spaceCompanyNames = [
    'Fuel Department',
    'Hull Inc',
    'Wings and Things',
    'Radar Solutions',
    'Cargo Bay',
    'Snacks Division',
    'Boom Boom Boosters',
    'Cosmic Parts'
  ];
  
  const [players, setPlayers] = useState([
    { id: 1, name: 'Fuel Department', diceCount: 4 },
    { id: 2, name: 'Hull Inc', diceCount: 2 },
    { id: 3, name: 'Wings and Things', diceCount: 4 },
    { id: 4, name: 'Radar Solutions', diceCount: 2 },
    { id: 5, name: 'Cargo Bay', diceCount: 3 },
    { id: 6, name: 'Snacks Division', diceCount: 6 },
    { id: 7, name: 'Boom Boom Boosters', diceCount: 3 },
    { id: 8, name: 'Cosmic Parts', diceCount: 2 }
  ]);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showTldrRules, setShowTldrRules] = useState(true);
  const [showStatsDrawer, setShowStatsDrawer] = useState(false);
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
    // Skip auto-generation on initial mount if a preserved setup exists
    if (!hasLoadedPreservedSetup && preservedPlayerSetup && preservedPlayerSetup.length > 0) {
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
        name: spaceCompanyNames[i % spaceCompanyNames.length],
        diceCount: defaultDiceCount,
      };
    });
    setPlayers(newPlayersList);
  }, [playerCount, hasLoadedPreservedSetup, preservedPlayerSetup]);

  const updatePlayer = (index, field, value) => {
    const newPlayers = players.map((player, i) => {
      if (i === index) {
        if (field === 'diceCount') {
          // Allow empty string for backspacing, but convert to number for validation
          if (value === '' || value === null || value === undefined) {
            return { ...player, [field]: '' };
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
  };

  const handleAttemptStartMission = () => {
    setError(null);
    const hasValidPlayers = players.every((p) => p.name.trim() !== '' && p.diceCount >= 1 && p.diceCount <= 20 && p.diceCount !== '');

    if (!hasValidPlayers) {
      const errorMessage = 'Every player needs a name and 1-20 dice.';
      setError(errorMessage);
      toast({
        title: 'Hold Up!',
        description: errorMessage,
        variant: 'destructive',
      });
      return;
    }
    setShowTldrRules(true);
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
      title: 'Engines Primed!',
      description: `Liftoff sequence initiated for ${players.length} player(s).`,
      variant: 'default',
      duration: 4000,
    });
  };

  const handleOpenRulesDrawer = () => {
    setShowTldrRules(true);
    setIsDrawerOpen(true);
  };

  // Use the exported functions to avoid duplication
  const renderDetailedRulesLocal = renderDetailedRules;
  const renderTldrRulesLocal = renderTldrRules;

  return (
    <div className="w-full max-w-md mx-auto bg-card dark:bg-slate-800 rounded-lg shadow-xl mt-4">
      <div className="flex items-center justify-between p-3 border-b dark:border-slate-700">
        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400" onClick={onBack}>
          <span className="text-lg font-bold">&lt;</span>
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowStatsDrawer(true)}
            className="text-slate-600 dark:text-slate-400"
          >
            <BarChart2 className="h-5 w-5" />
            <span className="sr-only">Stats</span>
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
              Number of Construction Bays (1-8):
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
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Configure Bays</h3>
            <div className="space-y-2 pr-1">
              {players.map((player, index) => (
                <div key={player.id} className="p-3 border rounded-md bg-slate-50 dark:bg-slate-700/60">
                  <div className="flex space-x-3">
                    <div className="flex-grow">
                      <Input
                        id={`player-${index}-name`}
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                        placeholder={spaceCompanyNames[index % spaceCompanyNames.length]}
                        className="text-sm h-9 dark:bg-slate-600 dark:border-slate-500"
                      />
                    </div>
                    <div className="w-20 flex-shrink-0">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm pointer-events-none">
                          🎲
                        </span>
                        <Input
                          id={`player-${index}-dice`}
                          type="number"
                          min="1"
                          max="20"
                          value={player.diceCount}
                          onChange={(e) => updatePlayer(index, 'diceCount', e.target.value)}
                          className="text-sm h-9 pl-8 dark:bg-slate-600 dark:border-slate-500"
                        />
                      </div>
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
                  'Show Full Rules'
                ) : (
                  <>
                    <Zap className="mr-1.5 h-3.5 w-3.5" /> Wait, What?! (TL;DR)
                  </>
                )}
              </Button>
            </div>
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
              Let's Build This Ship! <Rocket className="ml-2 h-5 w-5" />
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                Back to Base (Close)
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <StatsDrawer open={showStatsDrawer} onOpenChange={setShowStatsDrawer} />
    </div>
  );
}

export default GameSetup;

// Exported help content functions for reuse
export const renderDetailedRules = () => (
  <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
      <h4 className="font-bold text-lg text-amber-500 dark:text-amber-400 mb-2 flex items-center">
        <Target className="inline h-5 w-5 mr-2 flex-shrink-0" /> Your Glorious Goal:
      </h4>
      <p className="text-slate-600 dark:text-slate-300">
        Launch your magnificent (and hopefully not-too-explodey) rocket as far into the cold, uncaring void of space as
        possible.
      </p>
      <p className="text-slate-600 dark:text-slate-300 mt-1">
        Bigger rocket = bigger bragging rights (and more space snacks).
      </p>
      <p className="text-slate-600 dark:text-slate-300 mt-1">
        <strong className="text-red-500">Don't explode.</strong> Seriously.
      </p>
    </div>

    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
      <h4 className="font-bold text-lg text-sky-500 dark:text-sky-400 mb-2 flex items-center">
        <ListChecks className="inline h-5 w-5 mr-2 flex-shrink-0" /> Your Daring Maneuvers (On Your Turn):
      </h4>
      <ul className="space-y-3">
        <li className="pl-4 relative">
          <ChevronRight className="absolute left-[-4px] top-1 h-4 w-4 text-sky-500 dark:text-sky-400" />
          <strong className="text-sky-600 dark:text-sky-300">1. Shake, Rattle & Roll (Dice):</strong>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unleash the fury of ALL your dice! Let 'em fly!
          </p>
        </li>
<li className="pl-4 relative">
  <ChevronRight className="absolute left-[-4px] top-1 h-4 w-4 text-sky-500 dark:text-sky-400" />
  <strong className="text-sky-600 dark:text-sky-300">2. Construct-o-Rama (Must Place ≥1 Die):</strong>
  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
    You <em className="font-semibold text-amber-600 dark:text-amber-500">MUST</em> place at least one die. No hoarding,
    you dice miser! Each new piece must smooch an existing part of your glorious contraption (touching sides, not just
    corners, you cheeky rascal).
  </p>
  <div className="mt-2 space-y-2 pl-3 border-l-2 border-slate-200 dark:border-slate-600 ml-1">
    <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-600/50">
      <div className="flex items-center mb-1">
        <span className="flex gap-0.5 mr-2">
          <Dice1 className="h-4 w-4 text-green-500" />
          <Dice2 className="h-4 w-4 text-green-500" />
          <Dice3 className="h-4 w-4 text-green-500" />
          <Dice4 className="h-4 w-4 text-green-500" />
          <Dice5 className="h-4 w-4 text-green-500" />
        </span>
        <strong className="text-green-600 dark:text-green-400 text-xs uppercase tracking-wider">
          The Main Squeeze (Body Dice 1-5)
        </strong>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Build your rocket's magnificent body <strong className="text-green-500">DOWNWARDS</strong>, row by glorious row
        (a 1 as the nose, then a body row of 1-2, then 1-2-3, etc.). The bigger the body, the farther you MIGHT go
        (if your boosters work).
      </p>
    </div>
    <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-600/50">
      <div className="flex items-center mb-1">
        <Dice6 className="h-4 w-4 text-orange-500 mr-2" />
        <strong className="text-orange-600 dark:text-orange-400 text-xs uppercase tracking-wider">
          Fiery Bottoms (Booster Dice - 6s)
        </strong>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Slap these bad boys (dice showing a 6) onto the <strong className="text-orange-500">LOWEST</strong> row of your
        rocket's body. This locks in your rocket's majestic height. Choose wisely, space cadet! Once a booster is on,
        that body row is SET.
      </p>
    </div>
  </div>
</li>

        <li className="pl-4 relative">
          <ChevronRight className="absolute left-[-4px] top-1 h-4 w-4 text-sky-500 dark:text-sky-400" />
          <strong className="text-sky-600 dark:text-sky-300">3. Uh Oh, Space Junk! (Can't Place?):</strong>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            If you can't legally place any dice (sad trombone!), you must sacrifice one poor, innocent die to the
            dreaded <strong className="text-red-600 dark:text-red-400">"Fire Pile."</strong>
          </p>

        </li>
      </ul>
    </div>

    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50">
      <h4 className="font-bold text-lg text-red-500 dark:text-red-400 mb-2 flex items-center">
        <Skull className="inline h-5 w-5 mr-2 flex-shrink-0" /> Impending Doom (Watch Out!):
      </h4>

      <div className="flex items-start text-slate-600 dark:text-slate-300">
        <Flame className="h-4 w-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
        <p>
          <strong>KABOOM! (The Fire Pile):</strong> If the Fire Pile accumulates{' '}
          <span className="font-bold text-xl text-red-600 dark:text-red-500 mx-0.5">5</span>
          dice, your beautiful creation spectacularly disintegrates into a million tiny, very sad pieces. Game over,
          buttercup. Try not to cry (too much).
        </p>
      </div>
    </div>

    <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/30">
      <h4 className="font-bold text-lg text-teal-500 dark:text-teal-400 mb-2 flex items-center">
        <PartyPopper className="inline h-5 w-5 mr-2 flex-shrink-0" /> LIFTOFF!
      </h4>
      <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
        <li className="pl-4 relative">
          <ChevronRight className="absolute left-[-4px] top-1 h-4 w-4 text-teal-500 dark:text-teal-400" />
          Once your rocket body is a masterpiece of engineering (or at least, looks vaguely rocket-shaped) AND you've
          attached <strong className="text-teal-600 dark:text-teal-300">one or more Boosters</strong>, it's showtime!
        </li>

        <li className="pl-4 relative">
          <ChevronRight className="absolute left-[-4px] top-1 h-4 w-4 text-teal-500 dark:text-teal-400" />
          Roll <em className="font-semibold">ONLY</em> your Booster dice. Nail a 6 on any of them?{' '}
          <strong className="text-xl text-teal-500">WHOOSH!</strong> You've achieved LIFTOFF!
        </li>
        <li className="pl-4 relative">
          <ChevronRight className="absolute left-[-4px] top-1 h-4 w-4 text-teal-500 dark:text-teal-400" />
          The bigger your rocket and the more boosters you have, the farther you'll travel. Can you make it to Wolf-1061? We hear there’s life out there…
        </li>
      </ul>
    </div>
  </div>
);

export const renderTldrRules = () => (
  <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
    <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-3 text-xs sm:text-sm">
      <p className="flex items-center">
        <Target className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
        <strong>Goal:</strong> Launch FAR! Don't EXPLODE!
      </p>

      <div className="space-y-1">
        <p className="flex items-center">
          <ListChecks className="h-4 w-4 mr-2 text-sky-500 flex-shrink-0" />
          <strong>Turn:</strong>
        </p>
        <ol className="list-decimal list-outside pl-8 space-y-1 text-slate-600 dark:text-slate-300">
          <li>ROLL all your dice.</li>
          <li>
            BUILD ROCKET (Place ≥1 die, must touch existing parts):
            <ul className="list-disc list-outside pl-5 mt-1 space-y-0.5 text-slate-500 dark:text-slate-400">
              <li>
                <strong>Body (1-5):</strong> Build <span className="text-green-500 font-semibold">DOWN</span>. Bigger =
                Better.
              </li>
              <li>
                <strong>Boosters (6):</strong> Attach to <span className="text-orange-500 font-semibold">LOWEST</span>{' '}
                body row. Locks height.
              </li>
            </ul>
          </li>
          <li>
            CAN'T PLACE? 1 die to <strong className="text-red-500">Fire Pile</strong>.
          </li>
        </ol>
      </div>

      <p className="flex items-start">
        <Skull className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />{' '}
        <span>
          <strong className="text-red-500">Danger!</strong>
          <br />
          5 in Fire Pile = KABOOM! (You lose!)
        </span>
      </p>
      <p className="flex items-start">
        <PartyPopper className="h-4 w-4 mr-2 text-teal-500 flex-shrink-0" />{' '}
        <span>
          <strong className="text-teal-500">Liftoff!</strong>
          <br />
          Complete body + ≥1 Booster. Roll Boosters for a 6 = YOU WIN!
        </span>
      </p>
    </div>
  </div>
);

// Reusable HelpDrawer component for use during gameplay
export function HelpDrawer({ isOpen, onOpenChange, showCloseOnly = false }) {
  const [showTldrRules, setShowTldrRules] = useState(true);

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
                'Show Full Rules'
              ) : (
                <>
                  <Zap className="mr-1.5 h-3.5 w-3.5" /> Wait, What?! (TL;DR)
                </>
              )}
            </Button>
          </div>
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
