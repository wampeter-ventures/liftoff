/* eslint-disable react/prop-types */
const { useState, useEffect } = React;

function RocketGrid({
    grid,
    onDropDie,
    rocketHeight,
    boosterRowLocked,
    currentDice,
}) {
    const [dragOverPosition, setDragOverPosition] = useState(null);
    const [validPositions, setValidPositions] = useState(new Set());
    const [selectedDieValidPositions, setSelectedDieValidPositions] = useState(new Set());

    // Compute all valid positions for the *current hand* (to highlight green slots)
    useEffect(() => {
        const timer = setTimeout(() => {
            const { getValidPositions } = window.GameLogic;
            const unplacedDice = currentDice.filter((d) => !d.placed);
            const positions = new Set();
            unplacedDice.forEach((die) => {
                getValidPositions(
                    die.value,
                    grid,
                    rocketHeight,
                    boosterRowLocked,
                ).forEach((pos) => positions.add(pos));
            });
            setValidPositions(positions);
            
            // Also compute valid positions for the selected die specifically
            if (window.selectedDie && !window.selectedDie.placed) {
                const selectedPositions = new Set();
                getValidPositions(
                    window.selectedDie.value,
                    grid,
                    rocketHeight,
                    boosterRowLocked,
                ).forEach((pos) => selectedPositions.add(pos));
                setSelectedDieValidPositions(selectedPositions);
            } else {
                setSelectedDieValidPositions(new Set());
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [currentDice, grid, rocketHeight, boosterRowLocked]);

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

        for (let row = 1; row <= 5; row++) {
            for (let col = 1; col <= row; col++) {
                const pos = `${row}-${col}`;
                // If boosters are locked, only display labels for the booster row
                if (boosterRowLocked && row !== boosterRow) {
                    labels[pos] = [];
                    continue;
                }
                let eligible = [];
                if (
                    window.GameLogic.isValidPlacement(
                        pos,
                        col,
                        grid,
                        rocketHeight,
                        boosterRowLocked,
                    )
                ) {
                    eligible.push(col);
                }
                if (
                    window.GameLogic.isValidPlacement(
                        pos,
                        6,
                        grid,
                        rocketHeight,
                        boosterRowLocked,
                    )
                ) {
                    eligible.push(6);
                }
                labels[pos] = eligible;
            }
        }
        return labels;
    }, [grid, rocketHeight, boosterRowLocked]);

    const handleDragOver = (e, pos) => {
        e.preventDefault();
        setDragOverPosition(pos);
        e.dataTransfer.dropEffect = validPositions.has(pos) ? "move" : "none";
    };

    const clearDrag = () => setDragOverPosition(null);

    const handleDrop = (e, pos) => {
        e.preventDefault();
        clearDrag();
        try {
            const die = JSON.parse(e.dataTransfer.getData("text/plain"));
            onDropDie(die, pos);
        } catch (err) {
            console.error("Bad drop payload", err);
        }
    };

    const handleSlotClick = (pos) => {
        if (window.selectedDie && window.placeSelectedDie) {
            window.placeSelectedDie(pos);
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
                window.GameLogic.isValidPlacement(
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
    return (
        <div className="rocket-grid-container">
            <div className="rocket-grid">
                {[1, 2, 3, 4, 5]
                    .filter((row) => {
                        // Only hide rows if there is actually a 6 (booster) placed
                        const boosters = Object.keys(grid)
                            .filter((k) => grid[k] && grid[k].value === 6)
                            .map((k) => parseInt(k.split("-")[0]));
                        if (!boosters.length) return true;
                        const boosterRow = Math.min(...boosters);
                        return row <= boosterRow;
                    })

                    .map((row) => (
                        <div key={row} className={`rocket-row row-${row}`}>
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
                        className={`btn btn-launch ${!window.canLaunch() ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => {
                            if (!window.canLaunch()) {
                                window.setShowLaunchHelper &&
                                    window.setShowLaunchHelper(true);
                            } else {
                                window.attemptLaunch();
                            }
                        }}
                    >
                        Launch Rocket!
                    </button>
                </div>
            )}
        </div>
    );
}

window.RocketGrid = RocketGrid;
export default RocketGrid;
