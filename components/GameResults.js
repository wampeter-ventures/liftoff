import React from 'react';
import ResultsBackground from './ResultsBackground';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import {
  Rocket,
  Moon,
  Orbit,
  Globe as Planet,
  Disc3,
  XCircle,
  Bomb,
  TrendingUp,
  AlertOctagon,
} from 'lucide-react';
import GameLogic from '../lib/gameLogic';

function GameResults({
    rocketGrid,
    firePile,
    boosterRowLocked,
    outOfDiceFail = false,
    onRestart,
}) {
    const { getCompletedRows } = GameLogic;

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

    // Calculate victory level based on completed BODY rows only: 1=Moon, 2=Mars, 3=Jupiter, 4=Saturn, 5=Neptune
    const calculateVictoryLevel = () => {
        if (!boosterRowLocked) return 0; // need at least one booster
        const bodyRowCount = completedBodyRows.length;
        if (bodyRowCount >= 5) return 5; // Neptune
        if (bodyRowCount >= 4) return 4; // Saturn
        if (bodyRowCount >= 3) return 3; // Jupiter
        if (bodyRowCount >= 2) return 2; // Mars
        if (bodyRowCount >= 1) return 1; // Moon
        return 0;
    };

    const victoryLevel = calculateVictoryLevel();

    const getDestinationDetails = () => {
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
            case 1: // Moon (1 row)
                return {
                    name: 'TOUCHDOWN ON THE MOON!',
                    icon: <Moon className="h-16 w-16 sm:h-20 sm:w-20 text-slate-500" />,
                    description:
                        'One small step for your rocket, one giant leap for... well, you! You\'ve made it to Earth\'s trusty satellite. Not bad for a rookie!',
                    bgColor: 'bg-slate-100 dark:bg-slate-700/30',
                    textColor: 'text-slate-700 dark:text-slate-300',
                };
            case 2: // Mars (2 rows)
                return {
                    name: 'MARTIAN GETAWAY!',
                    icon: <Orbit className="h-16 w-16 sm:h-20 sm:w-20 text-orange-500" />,
                    description:
                        'You\'ve painted the Red Planet... with your rocket\'s landing gear! A successful mission to Mars. Hope you packed snacks for the little green dudes!',
                    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
                    textColor: 'text-orange-700 dark:text-orange-300',
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
            case 5: // Neptune (5 rows)
                return {
                    name: 'NEPTUNE\'S DEEP BLUE YONDER!',
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-blue-500" />,
                    description:
                        'You\'ve reached the windy, azure giant, Neptune! If you see any tridents, probably best to steer clear. What an epic journey!',
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    textColor: 'text-blue-700 dark:text-blue-300',
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
                <CardFooter className="p-4 sm:p-5 pt-6 sm:pt-8 border-t dark:border-slate-700/50">
                    <Button
                        size="lg"
                        onClick={onRestart}
                        className="w-full text-base font-semibold bg-[#075056] hover:bg-[#054547] dark:bg-[#075056] dark:hover:bg-[#054547] text-white"
                    >
                        Try Another Wild Launch! <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
            </div>
        </div>
    );
}

export default GameResults;