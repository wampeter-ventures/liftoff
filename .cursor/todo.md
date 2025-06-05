# Liftoff Game - Development Roadmap

## 🚨 Critical Bugs (High Priority)

### #001 - Mobile Drag & Drop Broken
**Issue:** Dragging and dropping on mobile isn't working after click-to-place implementation
**Impact:** Mobile users can't play the game properly
**Priority:** P0 - Blocks mobile gameplay
**Acceptance Criteria:**
- [ ] Touch drag events work on mobile devices
- [ ] Dice can be dragged from roll area to rocket grid
- [ ] Drop zones highlight correctly on mobile
- [ ] Both click-to-place AND drag-drop work simultaneously

### #002 - Game State Persistence
**Issue:** Game state doesn't clear when returning to setup screen
**Impact:** Previous game data carries over, causing confusion
**Priority:** P0 - Core game flow
**Acceptance Criteria:**
- [ ] All game state variables reset when going back to setup
- [ ] Rocket grid is completely cleared
- [ ] Player data is reset
- [ ] Fire pile is reset to 0
- [ ] Current dice array is emptied

### #003 - Rocket Layout Fix
**Issue:** When 5th row is built, no room for 6th row boosters
**Impact:** Visual layout breaks when adding boosters
**Priority:** P1 - Visual bug
**Acceptance Criteria:**
- [ ] 6th row space reserved for booster dice (6s)
- [ ] Layout adapts dynamically based on rocket height
- [ ] Visual spacing remains consistent

## 🎮 Game Logic & Rules

### #004 - Failed Launch Mechanics
**Issue:** Failed launch gives dice back instead of penalty
**Impact:** Game is too easy, lacks proper failure consequences
**Priority:** P1 - Game balance
**Acceptance Criteria:**
- [ ] On failed launch, one booster die goes to fire pile
- [ ] Remaining boosters stay as boosters for next attempt
- [ ] Turn advances to next player after failed launch
- [ ] No dice returned to player on failure

### #005 - Auto-Advance End Game
**Issue:** When all players run out of dice, game doesn't auto-advance
**Impact:** Players get stuck, unclear what to do next
**Priority:** P1 - Game flow
**Acceptance Criteria:**
- [ ] Detect when all players have no dice remaining
- [ ] Check if launch is possible with current rocket
- [ ] If launch possible, show launch prompt
- [ ] If not possible, auto-advance to results with "ran out of parts" message
- [ ] Use explosion-themed language for failure state

### #006 - Remove Rocket Height Limit
**Issue:** Rocket limited to 5 levels artificially
**Impact:** Limits strategic depth and player choice
**Priority:** P2 - Feature enhancement
**Acceptance Criteria:**
- [ ] Allow unlimited rocket height
- [ ] Create success messages for heights 6-50+
- [ ] Scale difficulty/victory conditions appropriately
- [ ] Update UI to handle taller rockets

## 🎨 User Experience & Interface

### #007 - Help System
**Issue:** No in-game instructions for new players
**Impact:** New users don't understand game rules
**Priority:** P1 - Onboarding
**Acceptance Criteria:**
- [ ] Add "?" button in top-right corner
- [ ] Create popup drawer with game rules
- [ ] Include visual examples of valid moves
- [ ] Show keyboard shortcuts and controls

### #008 - Launch Animation Sequence
**Issue:** Launch screen lacks drama and clarity
**Impact:** Climactic moment feels flat
**Priority:** P2 - Polish
**Acceptance Criteria:**
- [ ] Animate rocket movement during launch
- [ ] Roll booster dice one by one with suspense
- [ ] Clear visual feedback for success/failure
- [ ] Rocket flies off screen on success
- [ ] Rocket returns to pad on failure with sad animation

### #009 - Rocket Body Transition Animation
**Issue:** No visual feedback when switching to booster phase
**Impact:** Players confused about game state change
**Priority:** P2 - Visual feedback
**Acceptance Criteria:**
- [ ] Animate excess body rows crossing out
- [ ] Fade away inaccessible body positions
- [ ] Smoothly animate boosters sliding into position
- [ ] Clear visual distinction between phases

### #010 - Improved Launch Results Screen
**Issue:** Victory screen unclear about achievement level
**Impact:** Players don't understand how well they did
**Priority:** P2 - Feedback
**Acceptance Criteria:**
- [ ] Animate progression through planetary destinations
- [ ] Clear indication of final destination reached
- [ ] Fix duplicate display of 6s in body rows
- [ ] Scale celebration based on achievement level

### #011 - Player Count Default
**Issue:** Setup defaults to 1 player instead of 3
**Impact:** Users have to manually adjust for typical multiplayer use
**Priority:** P3 - UX improvement
**Acceptance Criteria:**
- [ ] Change default to 3 players on setup screen
- [ ] Remember last-used player count in localStorage
- [ ] Validate player count limits (1-8 players)

### #012 - Header State Management
**Issue:** "FIZZLE! FAIL! 💥" header shows during dice rolling
**Impact:** Premature failure message confuses players
**Priority:** P2 - Timing bug
**Acceptance Criteria:**
- [ ] Only show failure messages after dice finish rolling
- [ ] Proper state management for header messages
- [ ] Smooth transitions between game states

## 🔧 Technical Improvements

### #013 - Error Boundaries
**Issue:** No error handling for React component failures
**Impact:** App crashes instead of graceful degradation
**Priority:** P2 - Stability
**Acceptance Criteria:**
- [ ] Add error boundaries around major components
- [ ] Graceful fallback UI for errors
- [ ] Error reporting for debugging
- [ ] Recovery mechanisms where possible

### #014 - State Management Architecture
**Issue:** Complex state passed through many components
**Impact:** Hard to debug, maintain, and extend
**Priority:** P3 - Technical debt
**Acceptance Criteria:**
- [ ] Evaluate Redux Toolkit vs Zustand vs Context
- [ ] Implement chosen state management solution
- [ ] Migrate component prop drilling to central state
- [ ] Maintain existing functionality during migration

### #015 - Unit Testing
**Issue:** No automated tests for game logic
**Impact:** Risk of regression bugs in core gameplay
**Priority:** P3 - Quality assurance
**Acceptance Criteria:**
- [ ] Add Jest testing framework
- [ ] Test all game logic functions
- [ ] Test component rendering and interactions
- [ ] Add CI/CD testing pipeline

## 🎯 Strategic Features

### #016 - Enhanced Game Mechanics
**Issue:** Limited strategic depth and player choice
**Impact:** Game may become repetitive
**Priority:** P3 - Long-term engagement
**Research Needed:**
- [ ] Analyze current decision points and risk/reward balance
- [ ] Prototype new mechanics that add meaningful choices
- [ ] Test with focus groups for engagement
- [ ] Consider special dice, power-ups, or role cards

### #017 - Visual Rocket Mode
**Issue:** Abstract grid doesn't show actual rocket shape
**Impact:** Thematic disconnect, less engaging visually
**Priority:** P3 - Polish
**Acceptance Criteria:**
- [ ] Add toggle for "picture mode" vs "grid mode"
- [ ] Design rocket visual components
- [ ] Animate rocket assembly as pieces are placed
- [ ] Maintain gameplay clarity in visual mode

### #018 - Rocket Variety System
**Issue:** All rockets look/function the same
**Impact:** Limited replayability and customization
**Priority:** P4 - Future feature
**Acceptance Criteria:**
- [ ] Design different rocket types (cargo, exploration, military)
- [ ] Each type has different build requirements
- [ ] Unique victory conditions per rocket type
- [ ] Visual customization options

## 📱 Mobile & PWA

### #019 - Responsive Design Audit
**Issue:** Unknown issues on various mobile devices
**Impact:** Poor experience on different screen sizes
**Priority:** P2 - Accessibility
**Acceptance Criteria:**
- [ ] Test on iOS Safari, Android Chrome, tablet devices
- [ ] Fix layout issues on small screens
- [ ] Optimize touch targets for mobile
- [ ] Test landscape vs portrait orientations

### #020 - Haptic Feedback
**Issue:** No tactile feedback for mobile interactions
**Impact:** Less engaging mobile experience
**Priority:** P4 - Enhancement
**Acceptance Criteria:**
- [ ] Research Web Vibration API support
- [ ] Add haptic feedback for dice placement
- [ ] Vibrate on invalid moves
- [ ] Celebration haptics for success

## 🎵 Audio & Polish

### #021 - Sound Design System
**Issue:** No audio feedback for game actions
**Impact:** Less engaging and accessible experience
**Priority:** P3 - Polish
**Acceptance Criteria:**
- [ ] Add dice rolling sound effects
- [ ] Placement confirmation sounds
- [ ] Failure/explosion audio
- [ ] Victory fanfare
- [ ] Volume controls and mute option

### #022 - Advanced Dice Animations
**Issue:** Basic dice rolling animation
**Impact:** Less engaging tactile experience
**Priority:** P3 - Polish
**Acceptance Criteria:**
- [ ] 3D dice rolling animation
- [ ] Physics-based dice behavior
- [ ] Custom dice skins/themes
- [ ] Smooth transitions between states

### #023 - 8-bit Art Style Option
**Issue:** Current style may not appeal to all users
**Impact:** Limited aesthetic appeal
**Priority:** P4 - Theming
**Resources:** https://www.8bitcn.com/
**Acceptance Criteria:**
- [ ] Create 8-bit pixel art version of all assets
- [ ] Add theme toggle in settings
- [ ] Retro sound effects for 8-bit mode
- [ ] Maintain gameplay clarity in pixel style

## 📊 Analytics & Social

### #024 - Game Statistics
**Issue:** No performance tracking or achievements
**Impact:** Limited long-term engagement
**Priority:** P3 - Engagement
**Acceptance Criteria:**
- [ ] Track games played, win rate, best launches
- [ ] Wordle-style daily statistics
- [ ] Achievement system
- [ ] Local storage for privacy

### #025 - Social Features
**Issue:** No sharing or competitive elements
**Impact:** Limited viral potential
**Priority:** P4 - Growth
**Acceptance Criteria:**
- [ ] Shareable game results (like Wordle)
- [ ] Leaderboards (local/global)
- [ ] Player profiles with stats
- [ ] Game replay sharing

---

## 🏗️ Development Process

### Priority Levels
- **P0 (Critical):** Blocks core functionality, immediate fix required
- **P1 (High):** Impacts user experience significantly, fix in next sprint
- **P2 (Medium):** Important improvement, schedule in upcoming releases
- **P3 (Low):** Nice to have, add to backlog
- **P4 (Future):** Long-term vision, may require research

### Definition of Done
Each issue must include:
- [ ] Implementation complete
- [ ] Manual testing on desktop and mobile
- [ ] Code review completed
- [ ] Documentation updated if needed
- [ ] No regression in existing functionality



