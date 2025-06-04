// Game Logic for Liftoff - Unified placement rules for body rows (1‑5) and booster row (6‑only)

const GameLogic = {
    /* ------------------------------------------------ isValidPlacement */
    isValidPlacement(
        position,
        dieValue,
        rocketGrid,
        rocketHeight,
        boosterRowLocked,
    ) {
        if (rocketGrid[position]) return false;
        const [rowStr, colStr] = position.split("-");
        const row = parseInt(rowStr, 10),
            col = parseInt(colStr, 10);

        // For 1–5: must match slot label, can't mix with 6s, can't go below boosters
        if (dieValue >= 1 && dieValue <= 5) {
            const rowHasSix = Object.keys(rocketGrid).some((k) => {
                const [r] = k.split("-");
                return (
                    parseInt(r) === row &&
                    rocketGrid[k] &&
                    rocketGrid[k].value === 6
                );
            });
            if (rowHasSix) return false;
            if (dieValue !== col) return false;
            if (boosterRowLocked && row > rocketHeight)
                return false;
            return GameLogic.hasAdjacentDie(
                position,
                rocketGrid,
                rocketHeight,
            );
        }

        // For 6s
        if (dieValue === 6) {
            // 6s can never be placed in row 1 (top row is only for 1s)
            if (row === 1) return false;
            
            // Can't mix with 1-5s in the same row
            const rowHasRegular = Object.keys(rocketGrid).some(
                (k) => {
                    const [r] = k.split("-");
                    return (
                        parseInt(r) === row &&
                        rocketGrid[k] &&
                        rocketGrid[k].value !== 6
                    );
                },
            );
            if (rowHasRegular) return false;

            // What is the booster row? (lowest body row with any die + 1)
            let lowestBodyRow = 0;
            Object.keys(rocketGrid).forEach((k) => {
                const [r] = k.split("-");
                const d = rocketGrid[k];
                if (d && d.value >= 1 && d.value <= 5) {
                    lowestBodyRow = Math.max(
                        lowestBodyRow,
                        parseInt(r),
                    );
                }
            });
            const boosterRow = lowestBodyRow + 1;

            // If boosters are not yet locked, can only place 6s into the booster row
            if (!boosterRowLocked) {
                if (row !== boosterRow) return false;
            } else {
                // If locked, can only fill into the locked booster row
                const lockedRow = Object.keys(rocketGrid)
                    .filter(
                        (k) =>
                            rocketGrid[k] &&
                            rocketGrid[k].value === 6,
                    )
                    .map((k) => parseInt(k.split("-")[0]))[0];
                if (row !== lockedRow) return false;
            }

            // Must be adjacent to any existing die
            return GameLogic.hasAdjacentDie(
                position,
                rocketGrid,
                rocketHeight,
            );
        }

        // Not valid otherwise
        return false;
    },

    hasAdjacentDie(position, rocketGrid, rocketHeight) {
        const placed = Object.values(rocketGrid).filter((d) => d);
        if (placed.length === 0) {
            return position === "1-1";
        }
        const adjacent = GameLogic.getAdjacentPositions(
            position,
            rocketHeight,
        );
        return adjacent.some((p) => rocketGrid[p]);
    },

    getAdjacentPositions(position, rocketHeight) {
        const [rowPart, colPart] = position.split("-");
        const col = parseInt(colPart, 10);
        const adj = [];
        const row = parseInt(rowPart, 10);

        if (col > 1) adj.push(`${row}-${col - 1}`);
        if (col < row) adj.push(`${row}-${col + 1}`);
        if (row < 5) {
            const up = row + 1;
            adj.push(`${up}-${col}`);
            if (col <= up - 1) adj.push(`${up}-${col + 1}`);
        }
        if (row > 1) {
            const down = row - 1;
            if (col <= down) adj.push(`${down}-${col}`);
            if (col > 1 && col - 1 <= down)
                adj.push(`${down}-${col - 1}`);
        }
        return adj;
    },

    getValidPositions(
        dieValue,
        rocketGrid,
        rocketHeight,
        boosterRowLocked,
    ) {
        const positions = [];
        for (let row = 1; row <= 5; row++) {
            for (let col = 1; col <= row; col++) {
                const pos = `${row}-${col}`;
                if (
                    GameLogic.isValidPlacement(
                        pos,
                        dieValue,
                        rocketGrid,
                        rocketHeight,
                        boosterRowLocked,
                    )
                ) {
                    positions.push(pos);
                }
            }
        }
        return positions;
    },

    getCompletedRows(rocketGrid) {
        const complete = [];
        for (let r = 1; r <= 5; r++) {
            let full = true;
            for (let c = 1; c <= r; c++) {
                if (!rocketGrid[`${r}-${c}`]) {
                    full = false;
                    break;
                }
            }
            if (full) complete.push(r);
        }
        return complete;
    },

    calculateVictoryLevel(
        rocketGrid,
        rocketHeight,
        boosterRowLocked,
    ) {
        if (!boosterRowLocked) return 0; // need at least one booster
        const rows = GameLogic.getCompletedRows(rocketGrid).length;
        if (rows >= 5) return 3;
        if (rows >= 3) return 2;
        if (rows >= 1) return 1;
        return 0;
    },

    hasBoosters(rocketGrid) {
        return Object.values(rocketGrid).some(
            (v) => v && v.value === 6,
        );
    },
};

export default GameLogic; 