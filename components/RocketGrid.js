import React, { useState, useEffect } from 'react';
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
    highlightSlot,
    showBoosterAnimation,
    placementEffect,
    preparingLaunch
}) {
    const [dragOverPosition, setDragOverPosition] = useState(null);
    const [validPositions, setValidPositions] = useState(new Set());
    const [selectedDieValidPositions, setSelectedDieValidPositions] = useState(new Set());
    const [hasAnyPlacedDice, setHasAnyPlacedDice] = useState(false);
    const [showInitialGuide, setShowInitialGuide] = useState(true);
    const [showPictureMode, setShowPictureMode] = useState(false);

    const getPlanetName = (rows, boosters) => {
        if (rows >= 5) {
            if (boosters >= 6) return 'Eris';
            if (boosters >= 5) return 'Makemake';
            if (boosters >= 4) return 'Haumea';
            if (boosters >= 3) return 'Pluto';
            if (boosters >= 2) return 'Neptune';
            if (boosters >= 1) return 'Uranus';
            return 'Earth';
        }
        if (rows >= 4 && boosters >= 1) return 'Saturn';
        if (rows >= 3 && boosters >= 1) return 'Jupiter';
        if (rows >= 2 && boosters >= 1) return 'Ceres';
        if (rows >= 1 && boosters >= 1) return 'Mars';
        return 'Earth';
    };

    const rocketComplete = React.useMemo(() => {
        if (!boosterRowLocked) return false;
        const boosterRow = rocketHeight + 1;
        for (let row = 1; row <= rocketHeight; row++) {
            for (let col = 1; col <= row; col++) {
                if (!grid[`${row}-${col}`]) return false;
            }
        }
        for (let col = 1; col <= boosterRow; col++) {
            const die = grid[`${boosterRow}-${col}`];
            if (!die || die.value !== 6) return false;
        }
        return true;
    }, [grid, boosterRowLocked, rocketHeight]);

    const boosterCount = Object.values(grid).filter((d) => d && d.value === 6).length;

    const completedBodyRows = React.useMemo(() => {
        const allCompleted = GameLogic.getCompletedRows(grid);
        return allCompleted.filter((rowNum) => {
            for (let col = 1; col <= rowNum; col++) {
                const die = grid[`${rowNum}-${col}`];
                if (die && die.value !== 6) return true;
            }
            return false;
        });
    }, [grid]);

    const headerText = React.useMemo(() => {
        if (!boosterRowLocked) return 'Rocket Assembly';
        if (rocketComplete) return 'Ready to Attempt Launch';
        return `Mission: ${getPlanetName(rocketHeight, boosterCount)}`;
    }, [boosterRowLocked, rocketComplete, rocketHeight, boosterCount]);

    const boostersPlaced = Object.keys(grid)
        .filter((k) => grid[k] && grid[k].value === 6)
        .map((k) => parseInt(k.split('-')[0]));
    const boosterRow = boostersPlaced.length ? Math.min(...boostersPlaced) : null;


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

    // Compute eligibility *for display* for every slot on the grid
    const eligibleLabels = React.useMemo(() => {
        const labels = {};
        // Only show booster row if a 6 has been placed
        const boosterRowForLabels =
            boosterRowLocked &&
            Object.keys(grid)
                .map((k) => {
                    const v = grid[k];
                    if (v && v.value === 6) return parseInt(k.split('-')[0]);
                    return null;
                })
                .find((row) => row !== null);

        for (let row = 1; row <= 6; row++) {
            for (let col = 1; col <= row; col++) {
                const pos = `${row}-${col}`;
                // If boosters are locked, only display labels for the booster row
                if (boosterRowLocked && row !== boosterRowForLabels) {
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
        e.dataTransfer.dropEffect = validPositions.has(pos) ? 'move' : 'none';
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
            const die = JSON.parse(e.dataTransfer.getData('text/plain'));
            console.log('✅ RocketGrid parsed die data:', die);
            console.log('📞 RocketGrid calling onDropDie:', { die, pos });
            onDropDie(die, pos);
        } catch (err) {
            console.error('❌ RocketGrid bad drop payload:', err);
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
        if (highlightSlot === pos) cls += " confirm-slot";

        // Show "1/6", "2/6" for eligible, blank slots before any boosters are placed
        // After a booster is placed, only show 6s and empty booster slots in that row
        let slotLabel = '';
        if (!die) {
            const eligible = eligibleLabels[pos];
            if (eligible && eligible.length > 1) {
                slotLabel = eligible.join('/');
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
                {placementEffect && placementEffect.pos === pos && (() => {
                    const IconComp = placementEffect.Icon;
                    return (
                        <span className="placement-icon">
                            <IconComp size={24} />
                        </span>
                    );
                })()}
            </div>
        );
    };

    // Render
    return (
        <>
            <div className="rocket-header">
                <h3 className="rocket-section-header">{headerText}</h3>
                <button
                    type="button"
                    className="picture-toggle"
                    onClick={togglePictureMode}
                    aria-label="Toggle rocket view"
                    style={{
                        color: '#6b7280', // gray color
                        paddingLeft: '8px',
                        paddingBottom: '4px'
                    }}
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
                        style={{
                            transform: 'scale(1.2)',
                            transformOrigin: 'top center'
                        }}
                    />
                </div>


                {showBoosterAnimation && (
                    <div className="booster-celebration">
                        🔋 Boosters Online!
                    </div>
                )}
                
                <div className={`rocket-grid ${preparingLaunch ? 'pre-launch' : ''}`}> 
                    {[1, 2, 3, 4, 5, 6]
                        .filter((row) => {
                            if (!boosterRow) return true;
                            return row <= boosterRow;
                        })

                        .map((row) => (
                            <div key={row} className={`rocket-row row-${row} ${boosterRow === row ? 'booster-row' : ''}`}>
                                <div className="row-slots">
                                    {Array.from({ length: row }, (_, i) => {
                                        const pos = `${row}-${i + 1}`;
                                        return renderSlot(pos, i + 1);
                                    })}
                                </div>
                            </div>
                        ))}
                </div>
                {/* Launch button moved to main controls */}
            </div>
        </>
    );
}

export default RocketGrid;