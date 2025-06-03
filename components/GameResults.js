import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import {
  Rocket,
  Moon,
  Orbit,
  Globe as Planet,
  Disc3,
  CircleDot,
  XCircle,
  Bomb,
  CheckCircle2,
  Flame,
  TrendingUp,
  AlertOctagon,
} from "lucide-react";
import GameLogic from '../lib/gameLogic';

function GameResults({
    rocketGrid,
    firePile,
    rocketHeight,
    boosterRowLocked,
    onRestart,
}) {
    const { calculateVictoryLevel, getCompletedRows } = GameLogic;

    const victoryLevel = calculateVictoryLevel(
        rocketGrid,
        rocketHeight,
        boosterRowLocked,
    );
    const completedBodyRows = getCompletedRows(rocketGrid);
    const isExplosion = firePile >= 5;

    const getDestinationDetails = () => {
        if (isExplosion) {
            return {
                name: "TOTAL KABOOM!",
                icon: <Bomb className="h-16 w-16 sm:h-20 sm:w-20 text-red-500" />,
                description:
                    "Welp, your rocket is now a lovely collection of space confetti. Too many dice in the Fire Pile! Better luck next time, unless you enjoy expensive fireworks.",
                bgColor: "bg-red-100 dark:bg-red-900/30",
                textColor: "text-red-700 dark:text-red-300",
            };
        }

        switch (victoryLevel) {
            case 1: // Moon
                return {
                    name: "TOUCHDOWN ON THE MOON!",
                    icon: <Moon className="h-16 w-16 sm:h-20 sm:w-20 text-slate-500" />,
                    description:
                        "One small step for your rocket, one giant leap for... well, you! You've made it to Earth's trusty satellite. Not bad for a rookie!",
                    bgColor: "bg-slate-100 dark:bg-slate-700/30",
                    textColor: "text-slate-700 dark:text-slate-300",
                };
            case 2: // Mars
                return {
                    name: "MARTIAN GETAWAY!",
                    icon: <Orbit className="h-16 w-16 sm:h-20 sm:w-20 text-orange-500" />,
                    description:
                        "You've painted the Red Planet... with your rocket's landing gear! A successful mission to Mars. Hope you packed snacks for the little green dudes!",
                    bgColor: "bg-orange-100 dark:bg-orange-900/30",
                    textColor: "text-orange-700 dark:text-orange-300",
                };
            case 3: // Jupiter
                return {
                    name: "JUPITER CONQUERED!",
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-purple-500" />,
                    description:
                        "Whoa, Nelly! You've navigated the asteroid belt and said 'howdy' to the gas giant! That's some serious rocketry. You're practically a space legend!",
                    bgColor: "bg-purple-100 dark:bg-purple-900/30",
                    textColor: "text-purple-700 dark:text-purple-300",
                };
            case 4: // Saturn
                return {
                    name: "SATURN'S RINGSIDE SEATS!",
                    icon: <Disc3 className="h-16 w-16 sm:h-20 sm:w-20 text-amber-500" />,
                    description:
                        "You put a ring on it! Or, well, you got close enough to admire Saturn's magnificent rings. Hope you took pictures, because that's a long trip back!",
                    bgColor: "bg-amber-100 dark:bg-amber-900/30",
                    textColor: "text-amber-700 dark:text-amber-300",
                };
            case 5: // Uranus
                return {
                    name: "URANUS: THE FINAL FRONTIER (Almost)!",
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-cyan-500" />,
                    description:
                        "It's cold, it's gassy, it's Uranus! You've ventured into the icy outer reaches. Don't forget your thermal underwear!",
                    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
                    textColor: "text-cyan-700 dark:text-cyan-300",
                };
            case 6: // Neptune
                return {
                    name: "NEPTUNE'S DEEP BLUE YONDER!",
                    icon: <Planet className="h-16 w-16 sm:h-20 sm:w-20 text-indigo-500" />,
                    description:
                        "You've reached the windy, azure giant, Neptune! If you see any tridents, probably best to steer clear. What an epic journey!",
                    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
                    textColor: "text-indigo-700 dark:text-indigo-300",
                };
            case 7: // Pluto
                return {
                    name: "PLUTO: EDGE OF THE SOLAR SYSTEM (ish)!",
                    icon: <CircleDot className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />,
                    description:
                        "To Pluto and beyond (not really beyond, Pluto's pretty far)! You've reached the beloved dwarf planet. Send a postcard from the Kuiper Belt!",
                    bgColor: "bg-gray-200 dark:bg-gray-700/50",
                    textColor: "text-gray-700 dark:text-gray-300",
                };
            default: // Victory Level 0 or unhandled
                return {
                    name: "GROUNDED!",
                    icon: <XCircle className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 dark:text-gray-500" />,
                    description:
                        "Your rocket had the structural integrity of a wet paper bag. It didn't even bother to lift off. Back to the drawing board, chief!",
                    bgColor: "bg-gray-100 dark:bg-gray-800/30",
                    textColor: "text-gray-600 dark:text-gray-400",
                };
        }
    };

    const destination = getDestinationDetails();

    const renderRocketSummary = () => {
        const maxBodyRowsDisplay = 5;

        return (
            <div className="mt-4 p-3 sm:p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <h3 className="text-sm font-semibold text-center mb-2 text-slate-700 dark:text-slate-200">
                    Final Rocket Assembly
                </h3>
                <div className="space-y-1.5 text-xs">
                    {Array.from({ length: maxBodyRowsDisplay }, (_, i) => i + 1).map((rowNum) => (
                        <div
                            key={`summary-row-${rowNum}`}
                            className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-600/70 rounded"
                        >
                            <div className="w-12 font-medium text-slate-600 dark:text-slate-300 text-right pr-1">Row {rowNum}:</div>
                            <div
                                className="flex-grow grid gap-1 mx-1"
                                style={{ gridTemplateColumns: `repeat(${rowNum}, minmax(0, 1fr))` }}
                            >
                                {Array.from({ length: rowNum }, (_, colNum) => {
                                    const position = `${rowNum}-${colNum + 1}`;
                                    const die = rocketGrid[position];
                                    return (
                                        <div
                                            key={position}
                                            className={`h-5 w-full flex items-center justify-center rounded-sm border text-slate-700 dark:text-slate-200 ${
                                                die
                                                    ? "bg-green-200 dark:bg-green-700 border-green-400 dark:border-green-600"
                                                    : "bg-slate-200 dark:bg-slate-500 border-slate-300 dark:border-slate-400"
                                            }`}
                                        >
                                            {die ? die.value : <span className="opacity-50">·</span>}
                                        </div>
                                    );
                                })}
                            </div>
                            {completedBodyRows.includes(rowNum) ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 ml-1" />
                            ) : (
                                <div className="w-4 h-4 ml-1 flex-shrink-0" />
                            )}
                        </div>
                    ))}
                    <div
                        className={`flex items-center p-1.5 rounded mt-2 ${boosterRowLocked ? "bg-amber-100 dark:bg-amber-700/50" : "bg-slate-100 dark:bg-slate-600/70"}`}
                    >
                        <div className="w-12 font-medium text-slate-600 dark:text-slate-300 text-right pr-1">Boosters:</div>
                        <div
                            className="flex-grow grid gap-1 mx-1"
                            style={{ gridTemplateColumns: `repeat(${Math.max(1, rocketHeight)}, minmax(0, 1fr))` }}
                        >
                            {Array.from({ length: Math.max(1, rocketHeight) }, (_, colNum) => {
                                // Look for 6s in the booster row based on actual grid positions
                                const boosterPositions = Object.keys(rocketGrid).filter(pos => {
                                    const die = rocketGrid[pos];
                                    return die && die.value === 6;
                                });
                                const die = boosterPositions[colNum] ? rocketGrid[boosterPositions[colNum]] : null;
                                return (
                                    <div
                                        key={`booster-${colNum + 1}`}
                                        className={`h-5 w-full flex items-center justify-center rounded-sm border text-slate-700 dark:text-slate-200 ${
                                            die
                                                ? "bg-orange-300 dark:bg-orange-600 border-orange-500 dark:border-orange-500"
                                                : "bg-slate-200 dark:bg-slate-500 border-slate-300 dark:border-slate-400"
                                        }`}
                                    >
                                        {die ? die.value : <span className="opacity-50">·</span>}
                                    </div>
                                );
                            })}
                        </div>
                        {boosterRowLocked ? (
                            <Flame className="h-4 w-4 text-orange-500 flex-shrink-0 ml-1" />
                        ) : (
                            <div className="w-4 h-4 ml-1 flex-shrink-0" />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="game-results">
            <Card
                className={`w-full max-w-md shadow-xl dark:bg-slate-800 mx-auto overflow-hidden ${destination.borderColor ?? "border-transparent"}`}
            >
                <CardHeader className={`text-center p-4 sm:p-6 ${destination.bgColor}`}>
                    <div className="flex justify-center mb-3 sm:mb-4">{destination.icon}</div>
                    <CardTitle className={`text-xl sm:text-2xl font-bold tracking-tight ${destination.textColor}`}>
                        {destination.name}
                    </CardTitle>
                    <CardDescription className={`text-sm sm:text-base mt-1 ${destination.textColor} opacity-90 px-2`}>
                        {destination.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                        <div className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                            <div className="flex items-center justify-center text-sky-600 dark:text-sky-400">
                                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mr-1.5" />
                                <span className="text-xl sm:text-2xl font-bold">{completedBodyRows.length}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">Completed Body Rows</p>
                        </div>
                        <div
                            className={`p-2 sm:p-3 rounded-md ${isExplosion ? "bg-red-100 dark:bg-red-700/50" : "bg-slate-100 dark:bg-slate-700/50"}`}
                        >
                            <div
                                className={`flex items-center justify-center ${isExplosion ? "text-red-500 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}
                            >
                                <AlertOctagon className="h-5 w-5 sm:h-6 sm:w-6 mr-1.5" />
                                <span className="text-xl sm:text-2xl font-bold">{firePile}</span>
                            </div>
                            <p
                                className={`text-xs sm:text-sm mt-0.5 ${isExplosion ? "text-red-600 dark:text-red-300" : "text-slate-600 dark:text-slate-300"}`}
                            >
                                Dice in Fire Pile
                            </p>
                        </div>
                    </div>
                    {renderRocketSummary()}
                </CardContent>
                <CardFooter className="p-4 sm:p-5 border-t dark:border-slate-700/50">
                    <Button
                        size="lg"
                        onClick={onRestart}
                        className="w-full text-base font-semibold bg-black hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-800 text-white"
                    >
                        Try Another Wild Launch! <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default GameResults; 