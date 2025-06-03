Liftoff

Liftoff  is a collaborative dice‐building game in which players work together to assemble a rocket (the "body" pyramid of faces 1–5), then add boosters (face 6) to attempt a dramatic Lift-Off. The game lives primarily as a mobile-friendly web app (built with React) that can later be wrapped as a native app via Capacitor or similar. Our goal is to deliver a polished experience that:
Works seamlessly on mobile web (iPhone Safari/Chrome/Android Chrome), with responsive layout and offline support via PWA.

Follows the visual style of NYT Games (Wordle, Spelling Bee, Letter Boxed, etc.): clean white backgrounds, bold serif headlines, sans-serif body text, neat card layouts, pulsing/flashing UI elements, and minimal line icons.

Implements exactly the game mechanics (no separate booster row, one-die-per-turn requirement, Fire Pile, lift-off logic, etc.).

Integrates easily with future serverless functions or APIs (e.g. hints, stats, leaderboards).

Provides a clear architecture and state management plan so future contributors can add features, tests, or enhancements.

## 🏗️ Current Implementation Status

### Tech Stack
- **Frontend Framework**: React 18 (vanilla JS, no build tools)
- **Bundling**: Browser-based Babel compilation 
- **Styling**: Custom CSS with NYT Games inspiration (`nyt-styles.css`)
- **Architecture**: Component-based with centralized game logic
- **State Management**: React useState hooks in main App component
- **Drag & Drop**: HTML5 native drag/drop API
- **PWA**: Basic manifest, needs service worker implementation

### Components Structure
- `App.js` - Main game controller and state management (590 lines)
- `RocketGrid.js` - Pyramid rocket structure with drag/drop zones
- `DiceRoll.js` - Player dice rolling and display with animations
- `FirePile.js` - Fire pile danger zone with visual flame effects
- `GameSetup.js` - Initial player/game configuration
- `GameResults.js` - Victory/defeat screens with tier display
- `Die.js` - Individual die component with drag capabilities

### Game Logic (window.GameLogic)
- Placement validation rules (face matching, connectivity, booster rules)
- Adjacent position calculation for pyramid structure
- Victory condition calculation (Moon, Mars, Jupiter, Saturn, Neptune)
- Row completion detection and booster mechanics

### Current Features ✅
- 1-8 player support with configurable dice counts
- Sequential turn-based gameplay
- Drag & drop dice placement with visual feedback
- Real-time placement validation and hints
- Fire pile mechanics with explosion at 5 dice
- Booster row mechanics with height locking
- Launch sequence with booster dice rolls
- Victory tier calculation based on completed rows
- Undo functionality for moves
- Rolling animations and visual polish
- Mobile-responsive design (partially complete)

## 🎯 Development Preferences & Guidelines

### Code Style
- Prefer vanilla React with hooks over class components
- Keep components modular and focused on single responsibilities  
- Use `window.` globals for shared game logic and cross-component communication
- Maintain consistent naming: camelCase for JS, kebab-case for CSS classes
- Component files should export to `window` for global access

### UI/UX Priorities
- Mobile-first responsive design
- Touch-friendly interactions (drag/drop + tap alternatives)
- Clear visual feedback for all user actions
- Smooth animations that don't impact performance
- Accessible design with keyboard navigation support

### Game Design Principles
- Faithful implementation of original game rules
- Clear visual indicators for game state and valid moves
- Intuitive drag/drop with fallback touch interactions
- Immediate feedback for invalid moves
- Celebration/failure animations that enhance experience

### Technical Debt & Known Issues
- Need proper PWA service worker for offline support
- Large App.js component should be split into smaller pieces
- Better error boundaries and error handling needed
- Cross-browser testing required (especially mobile Safari)
- Performance optimization for multiple players

🧩 PART 1: Game Mechanics & Player Guide
🎯 Objective
Work together as a team to build and launch a rocket by placing standard six-sided dice (faces 1–6) into a specific pyramid structure (aka the rocket body plus a booster row). 
Proper placements earn progress; any forced "unused" dice become Fire Dice. 
If the Fire Pile ever contains 5 dice, the rocket explodes and everyone loses. 
At any time after (A) a completed rocket exists (aka 1, 3, 6, 10, or 15 dice in the shape of a completed triangle) and (B) at least one booster (a 6) is placed, any player may shout "Lift-Off!" to perform a final Booster-Driven Roll.  If any of the booster dice are rerolled as a 6, you succeed! If not, one booster die goes to the fire pile, the rest of the booster dice are discarded, and play continues. 
The more boosters you've placed, the more dice you roll—and the greater your chance to succeed and travel further into outer space as a team.
A successful game ends with a victory tier based on how many body rows were completed before placing that first booster.

🏗 Rocket Structure & Unlocking Rules
Your rocket consists of 6 rows (top to bottom). Each slot in each row only accepts one specific face value:
        Row 1 (1 slot):   [1]
       Row 2 (2 slots):  [1] [2]
     Row 3 (3 slots):   [1] [2] [3]
   Row 4 (4 slots):    [1] [2] [3] [4]
 Row 5 (5 slots):     [1] [2] [3] [4] [5]
Row 6 Booster (6 slots): [6]  [6]  [6]  [6]  [6]  [6]

Row Unlocking

**Initially**, only the single Row 1 `[1]` slot is "active" (flashing). All other future slots are rendered but *grayed-out* until unlocked.  You're building a rocket — you can't add a rocket piece that's floating in the air unconnected to other pieces!
When any die face `1` is placed into Row 1, Row 2 unlocks: slots `[1]` and `[2]` flash.  
After placing any die into Row 2, Row 3 unlocks: slots that "neighbor" the placed die in row 2 flash, but "floating" spots remain locked until connectivity.
At any time, a booster (a 6) can be placed to start a new row "below" the current-lowest row.  "Lowest" meaning visually lowest, and highest numerical row. At that point, the rocket body cannot be built below the row of boosters.

Placement Constraints

Face Match Only: A die showing face n may go only into a flashing slot labeled [n]. You cannot place a 5 into a row 2 [1] or [2] slot, etc.

Connectivity: A placed die must touch (orthogonally or diagonally) at least one previously placed die. You cannot place floating dice.

"Booster Lock" Rule: Once you place your first 6 into any slot in a booster row, the rocket's height locks. You can still fill any empty slots in rocket body rows above, or fill in the remainder of the booster row, but you may not create new rows below the active booster row.
6s (boosters) cannot be placed on rows that contain 1-5s (body parts)

Fire Pile Mechanics

Each turn/round, a player must place at least one die.

If a player rolls (or holds) dice but cannot legally place any of them into the flashing slots, the player is forced to move exactly one die from their rolled dice into the Fire Pile.

Any dice that the player chooses not to place (beyond the one they must place for that turn) remain in their pool for later turns—they do not automatically become Fire Dice.

The Fire Pile is visible beside the rocket. It holds up to 5 dice; once it hits 5, the rocket immediately explodes and the game ends in defeat (no further turns or Lift-Off allowed).

🔄 Turn Structure: Sequential Mode
1. Sequential Mode (One Player at a Time)
Roll Phase

On your turn, roll all Honor Dice currently in your cup/pool.

Placement Requirement

You must place exactly one of your rolled dice into a flashing slot (matching face + connectivity).
Recompute which slots are now flashing (playable) after each die is placed.
If none of your rolled dice can legally be placed, you must pick one die and send it to the Fire Pile.

After you satisfy that "one-die" rule, you may optionally place any additional legal dice from that same roll.

Any dice you choose not to place remain in your cup (safe for future turns).
 Any dice a player chooses *not* to place remain safely in their pool for later turns—they do **not** automatically go to Fire.  

Booster Row

If no 6s have been played, update the potential Booster row to one row below the current height of the rocket. As always, Boosters can only be placed touching a neighboring Body die.
If you placed any 6s in an active Booster row, no further body rows can be created below that booster row.

Fire Check
If Fire Pile ≥ 5, rocket instantly explodes (LOSS).

Otherwise, move to the next player (wrap around to Player 1 after Player N).

Repeat until either:

Someone calls "Lift-Off!" (see below), or

Fire reaches 5 (explosion), or

Rocket is fully built (all rows + boosters placed → automatically advanced to the Liftoff Phase).

🚀 Lift-Off Stage (Booster-Driven Roll)
At any time after you've placed at least one booster (6) and while Fire < 5, any player may declare "Lift-Off!" to initiate a final, dramatic dice roll:
Fetch "Booster Roll" Dice, removing them from the rocket

Obtain exactly the Booster dice from your rocket, which will mean you have from 1 to 6 booster dice. These are your Booster Roll Dice. These dice will be used to roll for liftoff!

Roll All Booster Dice

If any of these Booster dice show a face 6, SUCCESS → your rocket launches.

If none show 6, FAILURE → the boosters fail, one booster goes to the fire, the rest of the booster dice go back in the bag, and you continue the game with any remaining dice in player's hands. 

If Booster Success (a 6 rolled), Determine Victory Tier 
Count how many body rows (Rows 1–5) were fully completed before Lift-Off, and how many boosters you had placed:

Moon: Completed at least Row 1 (1 body dice) 
Mars: Completed at least Rows 1 & 2 (3 body dice) 
Jupiter: Completed Rows 1–3 (6 body dice).
Saturn: Completed Rows 1–4 (10 body dice).
Neptune:Completed Rows 1–5 (15 body dice).