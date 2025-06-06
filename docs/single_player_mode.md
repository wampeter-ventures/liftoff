# Single Player Puzzle Mode

## Overview
This feature introduces a daily solo challenge. Each day the player gets one puzzle with a unique rocket shape and a limited supply of dice "parts". The goal is to build the rocket and launch it as far as possible. Performance is tracked similar to Wordle statistics.

## Game Flow
1. **Daily Puzzle Selection**
   - A list of predefined puzzles resides in `lib/dailyPuzzles.js`.
   - The puzzle of the day is chosen by cycling through this list based on the current date.
2. **Attempt Restrictions**
   - Each puzzle can only be attempted once per calendar day. A flag is stored in `localStorage` using the date key.
3. **Gameplay**
   - The puzzle defines how many dice of each value are available. The player uses them to build the standard rocket grid.
   - There is only one player; unused dice remain for the next roll until all parts are placed or the rocket explodes.
4. **AI Generated Rocket Image**
   - Each puzzle has an image URL representing the rocket made from that day's shape. For now these are placeholder URLs.
5. **Stats Tracking**
   - Win/loss counts and current streak are stored in `localStorage` under `puzzleStats`.
   - A simple stats panel shows games played, wins and current streak.

## File Layout
- `lib/dailyPuzzles.js` – array of puzzle definitions.
- `pages/daily.js` – new page implementing the single player mode.
- `components/PuzzleStats.js` – small component to render statistics.

## Future Improvements
- Generate puzzle images dynamically from the shape.
- Share puzzles via URL or API instead of local list.
