# Adventure Mode Plan

## Overview

Implement a new game mode "Adventure Mode" that keeps the current rules as **Classic Mode**. Adventure Mode introduces:

- A "Lost in Space" mechanic replacing the Fire Pile.
- A checkpoint at Uranus that returns lost dice.
- A series of destinations starting at Mars and including secret levels (Eris and Wolf 1061).
- Bonus dice gained upon reaching Eris.
- Unlockable secret levels.

The existing code remains intact for Classic Mode and will be extended to support this new progression.

## User Stories

1. **As a player**, I can choose between Classic Mode and Adventure Mode when starting a game.
2. **As a player in Adventure Mode**, when I cannot place a die I must jettison it to **Lost in Space** instead of the Fire Pile.
3. **As a player in Adventure Mode**, my game does not end when the Lost in Space count grows; it only gets harder due to fewer dice.
4. **As a player**, reaching Uranus rescues all lost dice and returns them to the available pool.
5. **As a player**, after reaching Makemake for the first time, I unlock the Eris level with an additional booster row.
6. **As a player**, after reaching Eris once, I unlock the ultra level Wolf&nbsp;1061 with a second booster row and extra dice.

## High-Level Tasks

1. **Game Mode Selection**
   - Add a mode selector in `GameSetup` allowing Classic or Adventure.
   - Default to Classic to preserve current behaviour.
2. **Update Terminology**
   - Replace "Fire Pile" with "Lost in Space" when Adventure Mode is active.
   - Keep original text for Classic Mode.
3. **Lost Parts Logic**
   - Rename `firePile` state to a more generic variable such as `lostParts` and update all references when in Adventure Mode.
   - Remove the explosion condition (`firePile >= 5`) for Adventure Mode. Classic Mode retains it.
4. **Checkpoint at Uranus**
   - When the rocket reaches Uranus, move all dice from `lostParts` back into the players’ dice counts.
   - Show a modal or toast announcing the rescue.
5. **Level Progression**
   - Create a destination table (Mars, Ceres, Jupiter… Wolf&nbsp;1061) with required body rows and boosters.
   - Start Adventure Mode at Mars (row 1 already completed by default).
6. **Secret Level Unlocking**
   - Track completion of Makemake and Eris in local storage or state to unlock additional destinations.
   - Display "???" for Wolf&nbsp;1061 until unlocked.
7. **UI Adjustments**
   - Show a Lost in Space counter and list of lost dice.
   - Animate dice flying off when jettisoned and returning at Uranus.
   - Indicate unlocked secret levels on the destination tracker.
8. **Bonus Dice Award**
   - Grant 6 extra dice when reaching Eris to enable the Wolf&nbsp;1061 attempt.
   - Add these dice to the players’ pools and visually show them.
9. **Results Screen Updates**
   - Summarise destination reached, dice lost, and dice rescued.
   - Indicate unlocking of new levels if applicable.
10. **Testing & QA**
   - Playtest each rule change.
   - Ensure Classic Mode remains unchanged.
   - Verify dice loss and rescue flows work with multiple players.

## Detailed Implementation Notes

### Code Structure

- Main game logic lives in `pages/index.js` with supporting components in `components/` and placement rules in `lib/gameLogic.js`.
- The Fire Pile count and dice list are handled via `firePile` and `fireDice` state variables.
- Game results are rendered by `GameResults` with destination logic in `getDestinationDetails`.

### Functions to Extend

1. **GameSetup** (`components/GameSetup.js`)
   - Add a select/dropdown for **Game Mode**.
   - Include help text describing Adventure Mode rules.
2. **sendToFire** (`pages/index.js`)
   - Rename to `sendToLost`.
   - Skip the game-over check in Adventure Mode.
3. **checkVictoryConditions** (`pages/index.js`)
   - Use the new destination table when Adventure Mode is active.
4. **calculateVictoryLevel** (`lib/gameLogic.js` and `GameResults`)
   - Adjust logic to allow up to 12 booster slots for Wolf&nbsp;1061.
5. **resetGame**
   - Reset unlocked levels and lost parts correctly per mode.
6. **GameResults Component**
   - Display the Lost in Space count and highlight dice rescued at Uranus.
   - Show secret level unlock messages.
7. **UI Components**
   - Add new icons/animations for lost parts, rescue, and secret level transitions.

### Data Structures

- **Destinations Array**
  ```js
  const adventureDestinations = [
    { name: 'Mars', rows: 1, boosters: 1 },
    { name: 'Ceres', rows: 2, boosters: 1 },
    { name: 'Jupiter', rows: 3, boosters: 1 },
    { name: 'Saturn', rows: 4, boosters: 1 },
    { name: 'Uranus', rows: 5, boosters: 1, checkpoint: true },
    { name: 'Neptune', rows: 5, boosters: 2 },
    { name: 'Pluto', rows: 5, boosters: 3 },
    { name: 'Haumea', rows: 5, boosters: 4 },
    { name: 'Makemake', rows: 5, boosters: 5 },
    { name: 'Eris', rows: 5, boosters: 6, unlock: 'afterMakemake' },
    { name: 'Wolf 1061', rows: 5, boosters: 12, unlock: 'afterEris' },
  ];
  ```
- Track unlocked destinations in local storage (`localStorage.getItem('adventureUnlocks')`).

### Example Flow Changes

1. **Jettisoning a Die**
   - On placement failure, call `sendToLost(die)`.
   - Update UI: increment Lost in Space counter and animate the die leaving.
2. **Reaching Uranus**
   - Detect when the current destination index corresponds to Uranus.
   - Move all dice from `lostParts` back to their owners.
   - Play rescue animation and message.
3. **Unlocking Secret Levels**
   - When Makemake is completed, set `unlockedEris = true` in storage.
   - Display Eris in the destination tracker with a new booster row.
   - When Eris is completed, set `unlockedWolf = true` and provide six bonus dice.

### Future Considerations

- Balance dice counts for multiple players—playtesting will determine if additional dice are needed at other checkpoints.
- Potential achievements or analytics events for unlocking secret levels.
- Difficulty settings could modify how many dice are lost or how many boosters are required.

## Playtesting Checklist

1. Progress through each destination to ensure row and booster requirements are enforced.
2. Lose several dice before Uranus and confirm they are restored when reaching Uranus.
3. Confirm Makemake -> Eris -> Wolf&nbsp;1061 unlocking works across sessions.
4. Test with different player counts and verify dice distribution after rescues and bonuses.
5. Ensure Classic Mode still ends the game at 5 dice in the Fire Pile and that none of the new text appears.

## Additional Implementation Tasks

1. **Persistence Helpers**
   - Create utility functions in `lib/storage.js` to load and save Adventure Mode progress.
   - Use keys `adventureUnlocks` and `adventureDice` to keep local storage organized.
   - Provide a `resetAdventureProgress()` helper for debugging and testing.

2. **Bonus Dice Handling**
   - When Eris is reached, push six new dice objects into each player's `dicePool`.
   - Store the count of bonus dice in `adventureDice` so it survives page reloads.
   - On reset, remove any bonus dice to avoid inflating the classic starting count.

3. **Destination Tracker UI**
   - Build a sidebar component that lists the next three destinations with icons.
   - Locked destinations display a padlock until unlocked.
   - Highlight the current destination with a pulsing border or glow effect.

4. **Rescue Animation**
   - Add a small modal when Uranus is hit showing lost dice being towed back.
   - The modal auto-closes after a short delay to keep gameplay moving.

5. **Dedicated Adventure Functions**
   - Duplicate classic helpers (e.g., `calculateVictoryLevel`) and adapt them for the new rules instead of overloading existing ones.
   - Keep these in a separate section of each file so maintenance is straightforward.

6. **Edge Cases**
   - Ensure jettisoning the last die still triggers `checkVictoryConditions` so the game can end gracefully.
   - Verify the player can still undo a jettison before the next roll.


