import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Die from './Die';
import GameLogic from '../lib/gameLogic';

function RocketGrid({
    grid,
    onDropDie,
    rocketHeight,
    boosterRowLocked,
    currentDice,
    selectedDie,
    onPlaceSelectedDie,
    onCanLaunch,
    onAttemptLaunch,
    onSetShowLaunchHelper,
    undoCounter
}) {
    const [dragOverPosition, setDragOverPosition] = useState(null);
    const [validPositions, setValidPositions] = useState(new Set());
    const [selectedDieValidPositions, setSelectedDieValidPositions] = useState(new Set());
    const [hasAnyPlacedDice, setHasAnyPlacedDice] = useState(false);
    const [showInitialGuide, setShowInitialGuide] = useState(true);
    const [showPictureMode, setShowPictureMode] = useState(false);
    const [rowsToRemove, setRowsToRemove] = useState([]);
    const [rowsHidden, setRowsHidden] = useState([]);
    const prevBoosterLocked = React.useRef(boosterRowLocked);

    // Compute all valid positions for the *current hand* (to highlight green slots)
    useEffect(() => {
        const timer = setTimeout(() => {
            const unplacedDice = currentDice.filter((d) => !d.placed);
            const positions = new Set();
            unplacedDice.forEach((die) => {
                GameLogic.getValidPositions(
                    die.value,
                    grid,
                    rocketHeight,
                    boosterRowLocked,
                ).forEach((pos) => positions.add(pos));
            });
            setValidPositions(positions);
            
            // Also compute valid positions for the selected die specifically
            if (selectedDie && !selectedDie.placed) {
                const selectedPositions = new Set();
                GameLogic.getValidPositions(
                    selectedDie.value,
                    grid,
                    rocketHeight,
                    boosterRowLocked,
                ).forEach((pos) => selectedPositions.add(pos));
                setSelectedDieValidPositions(selectedPositions);
            } else {
                setSelectedDieValidPositions(new Set());
            }

            // Check if there are any placed dice
            const placedDice = Object.keys(grid).filter((k) => grid[k] && grid[k].placed);
            const hasDice = placedDice.length > 0;
            setHasAnyPlacedDice(hasDice);
            
            // After first die is placed, hide the initial guide
            if (hasDice && showInitialGuide) {
                setShowInitialGuide(false);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [currentDice, grid, rocketHeight, boosterRowLocked, selectedDie, showInitialGuide]);

    // Handle removal animation when boosters lock the rocket height
    useLayoutEffect(() => {
        if (boosterRowLocked && !prevBoosterLocked.current) {
            // Calculate rows that will no longer be used
            if (rocketHeight < 5) {
                const toRemove = [];
                for (let r = rocketHeight + 2; r <= 6; r++) {
                    toRemove.push(r);
                }
                if (toRemove.length) {
                    setRowsToRemove(toRemove);
                    const timer = setTimeout(() => {
                        setRowsHidden(toRemove);
                        setRowsToRemove([]);
                    }, 800);
                    return () => clearTimeout(timer);
                }
            }
        } else if (!boosterRowLocked && prevBoosterLocked.current) {
            // Reveal all rows when returning from failed launch
            setRowsHidden([]);
            setRowsToRemove([]);
        }
        prevBoosterLocked.current = boosterRowLocked;
    }, [boosterRowLocked, rocketHeight]);

    // Ensure rows reappear after an undo action
    useEffect(() => {
        setRowsHidden([]);
        setRowsToRemove([]);
    }, [undoCounter]);

    // Compute eligibility *for display* for every slot on the grid
    const eligibleLabels = React.useMemo(() => {
        const labels = {};
        // Only show booster row if a 6 has been placed
        const boosterRow =
            boosterRowLocked &&
            Object.keys(grid)
                .map((k) => {
                    const v = grid[k];
                    if (v && v.value === 6) return parseInt(k.split("-")[0]);
                    return null;
                })
                .find((row) => row !== null);

        for (let row = 1; row <= 6; row++) {
            for (let col = 1; col <= row; col++) {
                const pos = `${row}-${col}`;
                // If boosters are locked, only display labels for the booster row
                if (boosterRowLocked && row !== boosterRow) {
                    labels[pos] = [];
                    continue;
                }
                const eligible = new Set();
                if (
                    GameLogic.isValidPlacement(
                        pos,
                        col,
                        grid,
                        rocketHeight,
                        boosterRowLocked,
                    )
                ) {
                    eligible.add(col);
                }
                if (
                    GameLogic.isValidPlacement(
                        pos,
                        6,
                        grid,
                        rocketHeight,
                        boosterRowLocked,
                    )
                ) {
                    eligible.add(6);
                }
                labels[pos] = Array.from(eligible);
            }
        }
        return labels;
    }, [grid, rocketHeight, boosterRowLocked]);

    const handleDragOver = (e, pos) => {
        console.log('🎯 RocketGrid handleDragOver:', { pos, canDrop: validPositions.has(pos) });
        e.preventDefault();
        setDragOverPosition(pos);
        e.dataTransfer.dropEffect = validPositions.has(pos) ? "move" : "none";
    };

    const clearDrag = () => {
        console.log('🧹 RocketGrid clearDrag called');
        setDragOverPosition(null);
    };

    const togglePictureMode = () => {
        setShowPictureMode((prev) => !prev);
    };

    const handleDrop = (e, pos) => {
        console.log('📥 RocketGrid handleDrop called:', { pos });
        e.preventDefault();
        clearDrag();
        try {
            const die = JSON.parse(e.dataTransfer.getData("text/plain"));
            console.log('✅ RocketGrid parsed die data:', die);
            console.log('📞 RocketGrid calling onDropDie:', { die, pos });
            onDropDie(die, pos);
        } catch (err) {
            console.error("❌ RocketGrid bad drop payload:", err);
        }
    };

    const handleSlotClick = (pos) => {
        if (selectedDie && onPlaceSelectedDie) {
            onPlaceSelectedDie(pos);
        }
    };

    const renderSlot = (pos, label) => {
        const die = grid[pos];
        const canDrop = validPositions.has(pos);
        const canPlaceSelected = selectedDieValidPositions.has(pos);
        const isOver = dragOverPosition === pos;

        let cls = "grid-slot";
        if (die) cls += " occupied";
        if (canDrop) cls += " valid-drop";
        if (canPlaceSelected) cls += " valid-for-selected";
        if (isOver) cls += " drag-over";

        // Show "1/6", "2/6" for eligible, blank slots before any boosters are placed
        // After a booster is placed, only show 6s and empty booster slots in that row
        let slotLabel = "";
        if (!die) {
            const eligible = eligibleLabels[pos];
            if (eligible && eligible.length > 1) {
                slotLabel = eligible.join("/");
            } else if (eligible && eligible.length === 1) {
                slotLabel = eligible[0];
            } else if (
                GameLogic.isValidPlacement(
                    pos,
                    label,
                    grid,
                    rocketHeight,
                    boosterRowLocked,
                )
            ) {
                slotLabel = label;
            } // else, blank!
        }

        return (
            <div
                key={pos}
                className={cls}
                data-position={pos}
                onDragOver={(e) => handleDragOver(e, pos)}
                onDragLeave={clearDrag}
                onDrop={(e) => handleDrop(e, pos)}
                onClick={() => handleSlotClick(pos)}
            >
                {die ? (
                    <Die die={die} className="placed-die" />
                ) : (
                    <span className="required-number">{slotLabel}</span>
                )}
            </div>
        );
    };

    // Render
    const justLocked = boosterRowLocked && !prevBoosterLocked.current;

    return (
        <>
            <div className="rocket-header">
                <h3 className="rocket-section-header">Rocket Assembly</h3>
                <button
                    type="button"
                    className="picture-toggle"
                    onClick={togglePictureMode}
                    aria-label="Toggle rocket view"
                >
                    {showPictureMode ? (
                        <EyeOff size={20} />
                    ) : (
                        <Eye size={20} />
                    )}
                </button>
            </div>
            <div className="rocket-grid-container">
                {/* Rocket Guide Overlay */}
                <div
                    className={`rocket-guide-overlay ${showPictureMode ? 'on-top show-guide' : 'fade-to-background'}`}
                >
                    <img 
                        src="/rocket_big.png" 
                        alt="Rocket building guide" 
                        className="rocket-guide-image"
                    />
                </div>
                
                <div className="rocket-grid">
                    {[1, 2, 3, 4, 5, 6]
                        .filter((row) => !rowsHidden.includes(row))
                        .filter((row) => {
                            const boosters = Object.keys(grid)
                                .filter((k) => grid[k] && grid[k].value === 6)
                                .map((k) => parseInt(k.split("-")[0]));
                            if (!boosters.length) return true;
                            const boosterRow = Math.min(...boosters);
                            if (justLocked || rowsToRemove.includes(row)) return true;
                            return row <= boosterRow;
                        })
                        .map((row) => (
                            <div
                                key={row}
                                className={`rocket-row row-${row} ${rowsToRemove.includes(row) ? 'row-remove' : ''}`}
                            >
                                <div className="row-slots">
                                    {Array.from({ length: row }, (_, i) => {
                                        const pos = `${row}-${i + 1}`;
                                        return renderSlot(pos, i + 1);
                                    })}
                                </div>
                            </div>
                        ))}
                </div>

                {boosterRowLocked && (
                    <div className="launch-section">
                        <button
                            className={`btn btn-launch ${!onCanLaunch() ? "btn-disabled" : "btn-primary"}`}
                            onClick={() => {
                                if (onCanLaunch()) {
                                    onAttemptLaunch();
                                } else {
                                    onSetShowLaunchHelper && onSetShowLaunchHelper(true);
                                }
                            }}
                        >
                            Launch Rocket!
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default RocketGrid; 