import React, { useEffect, useState } from 'react';
import ResultsBackground from './ResultsBackground';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import {
  Rocket,
  Orbit,
  Globe as Planet,
  Disc3,
  XCircle,
  Bomb,
  TrendingUp,
  AlertOctagon,
  Dog,
  Cat,
  Ghost,
} from 'lucide-react';
import GameLogic from '../lib/gameLogic';

function GameResults({
    rocketGrid,
    firePile,
    boosterRowLocked,
    outOfDiceFail = false,
    onRestart,
    onWolfStart = null,
    wolfOutcome = null,
}) {
    const { getCompletedRows } = GameLogic;
    const [showWolfHint, setShowWolfHint] = useState(false);

    const allCompletedRows = getCompletedRows(rocketGrid);
    const isExplosion = firePile >= 5;

    // Filter to only count body rows (exclude booster rows that contain only 6s)
    const completedBodyRows = allCompletedRows.filter(rowNum => {
        // Check if this row contains any non-6 dice (making it a body row)
        for (let col = 1; col <= rowNum; col++) {
            const position = `${rowNum}-${col}`;
            const die = rocketGrid[position];
            if (die && die.value !== 6) {
                return true; // This is a body row
            }
        }
        return false; // This row only contains 6s (booster row)
    });

    // Calculate victory level using body rows and boosters
    const calculateVictoryLevel = () => {
        if (!boosterRowLocked) return 0; // need at least one booster

        const bodyRowCount = completedBodyRows.length;
        const boosterCount = Object.values(rocketGrid).filter(
            (d) => d && d.value === 6,
        ).length;

        if (bodyRowCount >= 5) {
            if (boosterCount >= 6) return 10; // Eris
            if (boosterCount >= 5) return 9; // Makemake
            if (boosterCount >= 4) return 8; // Haumea
            if (boosterCount >= 3) return 7; // Pluto
            if (boosterCount >= 2) return 6; // Neptune
            return 5; // Uranus
        }
        if (bodyRowCount >= 4) return 4; // Saturn
        if (bodyRowCount >= 3) return 3; // Jupiter
        if (bodyRowCount >= 2) return 2; // Ceres
        if (bodyRowCount >= 1) return 1; // Mars
        return 0;
    };

    const victoryLevel = calculateVictoryLevel();

    useEffect(() => {
        if (victoryLevel === 10 && onWolfStart && !wolfOutcome) {
            const t = setTimeout(() => setShowWolfHint(true), 500);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [victoryLevel, onWolfStart, wolfOutcome]);

    const getDestinationDetails = () => {
        if (wolfOutcome) {
            if (wolfOutcome === 'success') {
                return {
                    name: 'LIFE DISCOVERED ON WOLF-1061!',
                    icon: (
                        <div className="flex justify-center gap-2">
                            <Dog className="h-8 w-8 text-green-400" />
                            <Ghost className="h-8 w-8 text-fuchsia-400" />
                            <Cat className="h-8 w-8 text-blue-400" />
                        </div>
                    ),
                    description: (
                        <>
                            <strong>You did it! You actually did it.</strong>
                            {" Against all cosmic odds, your rocket punched through the edge of our solar system and landed in the mysterious Wolf 1061 system—13.8 light-years away and just maybe, possibly, PROBABLY crawling with adorable, weird, pizza-loving aliens."}
                            <br />
                            <br />
                            {"Your crew is now legendary. Your boosters are the stuff of bedtime stories. Your rocket is…well, a little charred, but wow."}
                            <br />
                            <br />
                            {"But wait. Did you know real astronomers think Wolf 1061c might "}
                            <em>ACTUALLY</em>
                            {" have the right conditions for life?"}
                            <br />👾 {"There could be oceans. There could be alien hamsters. There could be…you, if you build fast enough."}
                            <br />
                            <br />
                            {"Curious? Go down the rabbit hole: "}
                            <a
                                href="https://en.wikipedia.org/wiki/Wolf_1061"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                Could Wolf 1061c Host Life? (Wikipedia)
                            </a>
                        </>
                    ),
                    bgColor: 'bg-green-100 dark:bg-green-900/30',
                    textColor: 'text-green-700 dark:text-green-300',
                };
            }
            return {
                name: 'ERIS VICTORY!',
                icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-400" />,
                description:
                    'You reached Eris and tried for Wolf 1061, but the boosters fizzled. The crew shelves that dream for another day.',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                textColor: 'text-yellow-700 dark:text-yellow-300',
            };
        }
        if (isExplosion) {
            return {
                name: 'TOTAL KABOOM!',
                icon: <Bomb className="h-16 w-16 sm:h-20 sm:w-20 text-red-500" />,
                description:
                    'Welp, your rocket is now a lovely collection of space confetti. Too many dice in the Fire Pile! Better luck next time, unless you enjoy expensive fireworks.',
                bgColor: 'bg-red-100 dark:bg-red-900/30',
                textColor: 'text-red-700 dark:text-red-300',
            };
        }

        if (outOfDiceFail) {
            return {
                name: 'MISSION SCRUBBED!',
                icon: <AlertOctagon className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-500" />,
                description:
                    'The crew ran out of dice and your would-be rocket never came together. Time to regroup and try again!',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                textColor: 'text-yellow-700 dark:text-yellow-300',
            };
        }

        switch (victoryLevel) {
            case 1: // Mars (1 row)
                return {
                    name: 'MARTIAN GETAWAY!',
                    icon: <Orbit className="h-16 w-16 sm:h-20 sm:w-20 text-orange-500" />,
                    description:
                        'You\'ve painted the Red Planet... with your rocket\'s landing gear! A successful mission to Mars. Hope you packed snacks for the little green dudes!',
                    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
                    textColor: 'text-orange-700 dark:text-orange-300',
                };
            case 2: // Ceres (2 rows)
                return {
                    name: 'CERES STOPOVER!',
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-stone-500" />,
                    description:
                        'You\'ve made a pit stop at the solar system\'s favorite dwarf planet! Ceres may be small, but hey, at least the parking is free and there\'s plenty of water ice for slushies!',
                    bgColor: 'bg-stone-100 dark:bg-stone-900/30',
                    textColor: 'text-stone-700 dark:text-stone-300',
                };
            case 3: // Jupiter (3 rows)
                return {
                    name: 'JUPITER CONQUERED!',
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-purple-500" />,
                    description:
                        'Whoa, Nelly! You\'ve navigated the asteroid belt and said \'howdy\' to the gas giant! That\'s some serious rocketry. You\'re practically a space legend!',
                    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
                    textColor: 'text-purple-700 dark:text-purple-300',
                };
            case 4: // Saturn (4 rows)
                return {
                    name: 'SATURN\'S RINGSIDE SEATS!',
                    icon: <Disc3 className="h-16 w-16 sm:h-20 sm:w-20 text-amber-500" />,
                    description:
                        'You put a ring on it! Or, well, you got close enough to admire Saturn\'s magnificent rings. Hope you took pictures, because that\'s a long trip back!',
                    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                    textColor: 'text-amber-700 dark:text-amber-300',
                };
            case 5: // Uranus (5 rows, 1 booster)
                return {
                    name: 'URANUS SIDEWAYS ADVENTURE!',
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-teal-500" />,
                    description:
                        'You\'ve reached the tilted ice giant! Uranus rolls sideways through space, and now so does your rocket. Hope you didn\'t forget your space dramamine!',
                    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
                    textColor: 'text-teal-700 dark:text-teal-300',
                };
            case 6: // Neptune (5 rows, 2 boosters)
                return {
                    name: 'NEPTUNE\'S DEEP BLUE YONDER!',
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-blue-500" />,
                    description:
                        'You\'ve reached the windy, azure giant, Neptune! If you see any tridents, probably best to steer clear. What an epic journey!',
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    textColor: 'text-blue-700 dark:text-blue-300',
                };
            case 7: // Pluto (5 rows, 3 boosters)
                return {
                    name: "PLUTO'S DISTANT HELLO!",
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-amber-700" />,
                    description:
                        "You've made it to everyone's favorite ex-planet! Pluto may have been demoted, but your rocket sure hasn't. That's one heck of a long-distance relationship!",
                    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                    textColor: 'text-amber-700 dark:text-amber-300',
                };
            case 8: // Haumea (5 rows, 4 boosters)
                return {
                    name: "HAUMEA'S OVAL OFFICE!",
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-red-500" />,
                    description:
                        "You've reached the rugby ball of space! Haumea spins so fast it's stretched into an egg shape. Your rocket fit right in with all that cosmic stretching!",
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    textColor: 'text-red-700 dark:text-red-300',
                };
            case 9: // Makemake (5 rows, 5 boosters)
                return {
                    name: 'MAKEMAKE MASTERY!',
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-rose-700" />,
                    description:
                        "You've conquered the Easter Island of space! Makemake is as mysterious as its name is fun to say. Make-make-make your way to the ultimate cosmic achievement!",
                    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
                    textColor: 'text-rose-700 dark:text-rose-300',
                };
            case 10: // Eris (5 rows, 6 boosters)
                return {
                    name: 'ERIS: CHAOS CONQUERED!',
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-400" />,
                    description:
                        "You've tamed the goddess of chaos herself! Eris caused all that planet reclassification drama, but your rocket just caused the universe to applaud. Ultimate space legend achieved!",
                    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                    textColor: 'text-yellow-700 dark:text-yellow-300',
                };
            default: // Victory Level 0 or unhandled
                return {
                    name: 'GROUNDED!',
                    icon: <XCircle className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 dark:text-gray-500" />,
                    description:
                        'Your rocket had the structural integrity of a wet paper bag. It didn\'t even bother to lift off. Back to the drawing board, chief!',
                    bgColor: 'bg-gray-100 dark:bg-gray-800/30',
                    textColor: 'text-gray-600 dark:text-gray-400',
                };
        }
    };

    const destination = getDestinationDetails();


    return (
        <div className="game-results mt-4 px-4 relative">
            <ResultsBackground />
            {victoryLevel === 10 && showWolfHint && !wolfOutcome && (
                <div className="radio-signal" />
            )}
            <div className="relative z-10">
            <Card
                className={`w-full max-w-md shadow-xl dark:bg-slate-800 mx-auto overflow-hidden border-transparent`}
            >
                <CardHeader className={`text-center p-4 sm:p-6 pb-6 sm:pb-8 ${destination.bgColor}`}>
                    <div className="flex justify-center mb-3 sm:mb-4">{destination.icon}</div>
                    <CardTitle className={`text-lg sm:text-xl font-bold tracking-tight ${destination.textColor}`}>
                        {destination.name}
                    </CardTitle>
                    <CardDescription className={`text-xs sm:text-sm mt-2 ${destination.textColor} opacity-90 px-2 leading-relaxed`}>
                        {destination.description}
                    </CardDescription>
                </CardHeader>

                {!wolfOutcome && (
                    <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                            <div className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                                <div className="flex items-center justify-center text-sky-600 dark:text-sky-400">
                                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mr-1.5" />
                                    <span className="text-xl sm:text-2xl font-bold">{completedBodyRows.length}/5</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">Completed Body Rows</p>
                            </div>
                            <div
                                className={`p-2 sm:p-3 rounded-md ${isExplosion ? 'bg-red-100 dark:bg-red-700/50' : 'bg-slate-100 dark:bg-slate-700/50'}`}
                            >
                                <div
                                    className={`flex items-center justify-center ${isExplosion ? 'text-red-500 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}
                                >
                                    <AlertOctagon className="h-5 w-5 sm:h-6 sm:w-6 mr-1.5" />
                                    <span className="text-xl sm:text-2xl font-bold">{firePile}</span>
                                </div>
                                <p
                                    className={`text-xs sm:text-sm mt-0.5 ${isExplosion ? 'text-red-600 dark:text-red-300' : 'text-slate-600 dark:text-slate-300'}`}
                                >
                                    Dice in Fire!
                                </p>
                            </div>
                        </div>
                    </CardContent>
                )}
                <CardFooter className="p-4 sm:p-5 pt-6 sm:pt-8 border-t dark:border-slate-700/50 flex flex-col gap-3">
                    {victoryLevel === 10 && showWolfHint && !wolfOutcome && (
                        <div className="wolf-hint text-center space-y-2">
                            <p className="retro-space-text text-sm text-slate-600 dark:text-slate-300">
                                URGENT: Radio signal detected from the distant planet Wolf-1061, located in the rare Goldilocks Zone.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <Button
                                    size="lg"
                                    onClick={onWolfStart}
                                    className="w-full text-base font-semibold bg-yellow-500 hover:bg-yellow-600 text-black"
                                >
                                    Explore?
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={onRestart}
                                    className="w-full text-base font-semibold bg-black hover:bg-gray-800 text-white"
                                >
                                    Back to Base
                                </Button>
                            </div>
                        </div>
                    )}
                    {!wolfOutcome &&
                        !(victoryLevel === 10 && showWolfHint && !wolfOutcome) && (
                            <Button
                                size="lg"
                                onClick={onRestart}
                                className="w-full text-base font-semibold bg-black hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-800 text-white"
                            >
                                Try Another Wild Launch!{' '}
                                <Rocket className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    {wolfOutcome && (
                        <Button
                            size="lg"
                            onClick={onRestart}
                            className="w-full text-base font-semibold bg-black hover:bg-gray-800 text-white"
                        >
                            Back to Base
                        </Button>
                    )}
                </CardFooter>
            </Card>
            </div>
        </div>
    );
}

export default GameResults;
