# Liftoff Game - Development Roadmap

New things:

- player setup: Remove "Number of Players" dropdown, and just have it be a list of Players, and a + button to add more rows and a delete button to delete a row


- haptics for dice rolling and placing into body and into fire





-----

## 🚨 Critical Issues (P0 - Immediate)

### #001 - Mobile Drag and Drop System Failure
**Status:** Critical Bug  
**Impact:** Mobile users cannot play the game at all  
**Description:** The drag and drop functionality that works on desktop completely fails on mobile devices. Touch events are not properly handled, making the primary interaction method unusable.

**Root Cause Analysis Needed:**
- Touch event handlers may be missing or incorrect
- Click-to-place implementation may have broken touch events
- Mobile viewport/touch target sizing issues

**Acceptance Criteria:**
- [ ] Touch drag events register correctly on iOS Safari and Android Chrome
- [ ] Dice can be dragged from roll area to rocket grid using touch
- [ ] Drop zones provide visual feedback during touch drag operations
- [ ] Both click-to-place AND drag-drop work simultaneously without conflict
- [ ] Touch targets are appropriately sized (minimum 44px per iOS guidelines)
- [ ] Tested on iPhone, Android phone, and tablet devices

**Technical Approach:**
- Implement `touchstart`, `touchmove`, `touchend` event handlers
- Add feature detection to use appropriate event types
- Ensure preventDefault() is called to avoid scroll conflicts

---

### #002 - Game State Persistence and Reset Issues

**Status:** ✅ RESOLVED  
**Description:** When players navigate back to setup or start a new game, clear the previous game data BUT retain the original/previous player count, player names and dice counts at the setup screen, so that they can replay the game with the same criteria.

**Implementation Summary:**
- Added `originalPlayerSetup` state to track initial player configuration
- Modified `startGame()` to store original setup data
- Created `resetGamePreservingSetup()` function for game resets that maintain player data
- Updated `GameSetup` component to accept and use preserved player configuration
- Modified back button and restart functions to use setup-preserving reset

**Acceptance Criteria:**
- [x] Game state reset when returning to setup screen
- [x] All game state variables properly initialized to default values
- [x] Rocket grid visually clears all dice positions
- [x] Player configuration arrays reset to original choice (player count, player names and dice count)
- [x] Fire pile counter returns to 0
- [x] Current dice roll array emptied
- [x] Turn tracking reset to player 1
- [x] Booster lock state reset to false

**Testing Notes:**
- Setup screen now pre-populates with previous player configuration when returning from game
- Going to welcome screen clears preserved setup (fresh start)
- All game state properly resets while preserving original player setup

---



### #005 - End Game State Detection and Flow
**Status:** Game Flow Bug  
**Impact:** Players get stuck when all dice from all players are exhausted  
**Description:** When all players have zero dice remaining, the game doesn't automatically detect this condition or guide players toward resolution, leading to confusion about how to proceed.

**Scenarios to Handle:**
1. All players out of dice + launchable rocket exists → prompt launch
2. All players out of dice + unlaunchable rocket → auto-fail with message
3. Mixed scenarios with some players having dice

**Acceptance Criteria:**
- [ ] Automatic detection when all players reach zero dice
- [ ] Check if current rocket configuration allows launch attempt
- [ ] If launchable: show launch prompt with "final attempt" messaging
- [ ] If not launchable: auto-advance to results with "ran out of rocket parts" message
- [ ] Use thematic language ("explosive failure", "mission scrubbed", etc.)
- [ ] Proper statistics tracking for both end-game scenarios
- [ ] Clear visual indication of end-game state

**User Experience Considerations:**
- End-game messaging should feel thematic and satisfying, not punishing
- Players should understand why the game ended
- Smooth transition to results/restart flow

---

### #006 - Remove Arbitrary Rocket Height Restrictions
**Status:** Feature Enhancement  
**Impact:** Artificial limitation reduces strategic depth  
**Description:** Current implementation limits rockets to 5 levels, but the game rules and logic could support unlimited height, providing more strategic options and replayability.

**Acceptance Criteria:**
- [ ] Remove hardcoded height limit of 5 rows
- [ ] Create success tier messaging for heights 6-10, 11-20, 21-50, 50+
- [ ] Ensure UI scales appropriately for taller rockets
- [ ] Maintain performance with larger grid sizes
- [ ] Update victory condition calculations for unlimited height
- [ ] Preserve game balance (higher rockets = more risk but better rewards)

**Success Tier Examples:**
- 6-7 rows: "Orbital Mission Success"
- 8-10 rows: "Moon Landing Achievement"  
- 11-15 rows: "Mars Mission Accomplished"
- 16+ rows: "Deep Space Explorer"

---

## 🎨 User Experience (P1-P2)

---

### #008 - Enhanced Launch Sequence Animation
**Status:** Polish Enhancement  
**Impact:** Climactic moment lacks drama and clarity  
**Description:** The launch phase should be the most exciting moment of the game, but currently feels flat and lacks clear visual feedback about success/failure.

**Current Issues:**
- All booster dice roll simultaneously (no suspense)
- Success/failure outcome not immediately clear
- No celebration or commiseration animation
- Transition back to game state is abrupt

**Acceptance Criteria:**
- [ ] Sequential booster dice rolling with timing suspense
- [ ] Rocket movement animation during launch sequence
- [ ] Clear visual indication of success threshold vs. actual roll
- [ ] Success: rocket flies upward off-screen with celebration
- [ ] Failure: rocket returns to pad with explosion/smoke effects
- [ ] Smooth transition back to game state after animation
- [ ] Audio cues synchronized with visual elements (if audio implemented)

**Animation Sequence Design:**
1. Zoom focus to launch pad
2. Roll booster dice one-by-one with sound
3. Running total indicator showing progress toward target
4. Moment of suspense before final outcome
5. Celebration or failure animation
6. Results summary with achievements
7. Return to game or setup

---

### #009 - Rocket Construction Phase Transitions
**Status:** Visual Feedback Issue  
**Impact:** Players confused about game state changes  
**Description:** When the rocket transitions from body-building phase to booster phase, there's no clear visual feedback about what has changed or what positions are now available/restricted.

**Transition Events:**
- First booster die placed (locks booster row)
- Body rows become inaccessible
- Available positions change dramatically

**Acceptance Criteria:**
- [ ] Smooth visual transition when booster phase begins
- [ ] Fade out or cross out inaccessible body positions
- [ ] Highlight available booster positions
- [ ] Clear messaging about phase change ("Now building boosters!")
- [ ] Animated indicators showing rule changes
- [ ] Maintain visual clarity of existing dice placements

**Visual Design:**
- Use color coding: green for available, red for blocked, gray for filled
- Add subtle animations to draw attention to newly available areas
- Consider adding a "phase indicator" UI element

---

### #010 - Launch Results and Victory Communication
**Status:** Feedback Enhancement  
**Impact:** Players don't understand achievement levels  
**Description:** The victory screen doesn't clearly communicate how well players performed relative to possible outcomes, diminishing the satisfaction of success.

**Current Issues:**
- No clear indication of achievement level (basic vs. excellent)
- Duplicate display bug showing 6s in body rows
- Static results don't convey journey/progression
- Lack of context about difficulty of achievement

**Acceptance Criteria:**
- [ ] Animated progression showing rocket journey to destination
- [ ] Clear achievement level indication (Bronze/Silver/Gold or similar)
- [ ] Fix duplicate 6s display bug in body row visualization
- [ ] Destination-based messaging (orbit, moon, Mars, deep space)
- [ ] Performance summary: rows completed, total dice used, attempts
- [ ] Scaled celebration animation based on achievement level
- [ ] Social sharing ready format for results

**Achievement Tiers:**
- Level 1: Low Earth Orbit (minimal success)
- Level 2: Lunar Mission (solid achievement)  
- Level 3: Interplanetary Mission (excellent execution)
- Level 4+: Deep Space Explorer (exceptional performance)


---

## 🎵 Polish and Engagement (P3-P4)

### #016 - Audio Design System Implementation
**Status:** Experience Enhancement  
**Impact:** Missing auditory feedback reduces engagement  
**Description:** No audio feedback exists for game actions, missing an opportunity to enhance game feel and accessibility.

**Sound Design Requirements:**
- Dice rolling sound (satisfying physics-based audio)
- Placement confirmation (positive reinforcement)
- Invalid move feedback (gentle correction)
- Launch sequence audio (building tension)
- Success/failure audio (emotional payoff)

**Acceptance Criteria:**
- [ ] Comprehensive sound effect library with consistent style
- [ ] Dice rolling physics-based audio with multiple variations
- [ ] Placement confirmation sounds with pitch variation
- [ ] Launch sequence audio building to climax
- [ ] Victory/failure audio appropriate to outcome level
- [ ] Volume controls and mute toggle
- [ ] Audio accessibility features (visual alternatives)
- [ ] Performance optimization (audio loading, caching)

**Technical Considerations:**
- Web Audio API vs. HTML5 audio elements
- Mobile audio playback restrictions
- Battery impact optimization
- Accessibility alternatives for deaf/hard-of-hearing users

---

### #017 - Advanced Dice Physics and Animation
**Status:** Visual Polish  
**Impact:** Current dice animation feels basic and non-tactile  
**Description:** Enhanced dice rolling animation would significantly improve the tactile satisfaction of the core game mechanic.

**Animation Enhancement Goals:**
- 3D dice rolling with realistic physics
- Individual dice personality (slight variations)
- Satisfying collision and settling behavior
- Smooth integration with existing game flow

**Acceptance Criteria:**
- [ ] 3D dice models with appropriate visual fidelity
- [ ] Physics-based rolling animation with realistic behavior
- [ ] Multiple dice rolling simultaneously without performance issues
- [ ] Customizable dice themes/skins for personalization
- [ ] Smooth transitions between rolled and placed states
- [ ] Performance optimization for mobile devices
- [ ] Fallback to 2D animation on low-performance devices

**Technical Approach:**
- Three.js or CSS 3D transforms for 3D dice
- Physics engine integration (Cannon.js or similar)
- Performance profiling and optimization
- Progressive enhancement approach

---

### #018 - Visual Rocket Assembly Mode
**Status:** Thematic Enhancement  
**Impact:** Abstract grid doesn't convey rocket-building theme  
**Description:** Adding a visual mode where players see an actual rocket being assembled would significantly enhance thematic engagement and visual appeal.

**Design Vision:**
- Toggle between "grid mode" (current) and "picture mode" (new)
- Actual rocket components placed as dice are added
- Animation of rocket assembly progress
- Maintaining gameplay clarity in visual mode

**Acceptance Criteria:**
- [ ] Toggle button to switch between grid and visual modes
- [ ] Rocket component artwork for different sections
- [ ] Smooth animation as components are placed
- [ ] Visual representation of dice values through component types
- [ ] Maintain all gameplay clarity and interaction in picture mode
- [ ] Booster attachment visualization
- [ ] Launch animation integration with visual rocket

**Art Requirements:**
- Modular rocket components (nose cone, body sections, boosters)
- Consistent art style with current UI
- Mobile-optimized visual complexity
- Color coding to maintain dice value clarity

---

## 📊 Analytics and Social Features (P3-P4)

### #019 - Player Statistics and Achievement System
**Status:** Engagement Feature  
**Impact:** No long-term progression or performance tracking  
**Description:** Players have no way to track improvement, compare performances, or work toward long-term goals, limiting replayability.

**Statistics to Track:**
- Games played, win rate, average rocket height
- Best single launch distance
- Total dice placed, success rate by position
- Streak tracking (consecutive successes)
- Time-based statistics (daily, weekly, monthly)

**Achievement Categories:**
- **Builder**: Row completion achievements
- **Booster**: Launch success achievements  
- **Explorer**: Distance/height achievements
- **Strategist**: Efficiency and optimization achievements
- **Social**: Multiplayer and sharing achievements

**Acceptance Criteria:**
- [ ] Local storage system for persistent statistics
- [ ] Wordle-style daily statistics dashboard
- [ ] Achievement system with unlockable rewards (dice themes, etc.)
- [ ] Performance trends and improvement tracking
- [ ] Privacy-conscious implementation (local storage only)
- [ ] Export/import functionality for data portability
- [ ] Achievement sharing integration

---

### #020 - Social Sharing and Competition
**Status:** Viral Growth Feature  
**Impact:** Limited viral potential and community building  
**Description:** No sharing mechanisms exist to help players communicate their achievements or engage with others around the game.

**Sharing Features:**
- Wordle-style emoji result sharing
- Screenshot generation of completed rockets
- Challenge creation (specific starting conditions)
- Performance leaderboards (opt-in)

**Acceptance Criteria:**
- [ ] One-click sharing of game results with emoji summary
- [ ] Automated screenshot generation of completed rockets
- [ ] Daily challenge system with shared starting conditions
- [ ] Local leaderboard system (friends-based)
- [ ] Global leaderboard with privacy controls
- [ ] Challenge links that recreate specific game conditions
- [ ] Social media platform integration (Twitter, Facebook, Discord)

**Privacy Considerations:**
- All sharing opt-in only
- No personal data collection
- Local-first approach with optional sharing
- Clear privacy policy and controls

---

## 🔮 Future Vision (P4 - Long-term)

### #021 - Expanded Game Mechanics System
**Status:** Strategic Enhancement Research  
**Impact:** Current mechanics may become repetitive over time  
**Description:** Research and prototype additional mechanics that could add strategic depth while maintaining the core collaborative experience.

**Mechanic Categories to Research:**
- **Special Dice**: Dice with unique placement rules or effects
- **Player Roles**: Asymmetric player powers or specializations
- **Mission Cards**: Specific objectives that modify victory conditions
- **Component Cards**: Special rocket parts with unique properties

**Research Methodology:**
- [ ] Analyze current decision points and risk/reward balance
- [ ] Survey players about desired complexity levels
- [ ] Prototype mechanics in isolated test environment
- [ ] Focus group testing for engagement and accessibility
- [ ] Balance testing with various player counts

**Success Criteria:**
- Mechanics add meaningful choices without overwhelming complexity
- Maintain collaborative feel rather than competitive
- Preserve accessibility for new players
- Enhance rather than replace core mechanics

---

### #022 - Rocket Variety and Customization System
**Status:** Replayability Enhancement  
**Impact:** All rockets currently function identically  
**Description:** Different rocket types with unique characteristics could significantly enhance replayability and player expression.

**Rocket Types Concepts:**
- **Cargo Rocket**: Larger capacity, requires more boosters
- **Exploration Rocket**: Special victory conditions, science bonuses
- **Military Rocket**: Faster build requirements, different risk profile
- **Tourist Rocket**: Passenger safety requirements, comfort metrics

**Customization Elements:**
- Visual themes and color schemes
- Component styling options
- Player emblems or team markings
- Rocket naming and history tracking

**Acceptance Criteria:**
- [ ] Design balanced rocket types with distinct gameplay
- [ ] Unique victory conditions and build requirements per type
- [ ] Visual customization system with unlockable options
- [ ] Rocket selection phase integration
- [ ] Achievement system tied to rocket variety mastery
- [ ] Maintain game balance across all rocket types

---

### #023 - Retro Gaming Theme Option
**Status:** Aesthetic Variety  
**Impact:** Current art style may not appeal to all player segments  
**Description:** Adding an 8-bit pixel art theme option could appeal to retro gaming enthusiasts and provide visual variety.

**Theme Elements:**
- 8-bit pixel art conversion of all game assets
- Retro sound effects and chiptune audio
- CRT screen simulation effects
- Retro gaming color palettes
- Period-appropriate UI fonts and styling

**Acceptance Criteria:**
- [ ] Complete 8-bit art asset library maintaining visual clarity
- [ ] Theme toggle in settings with instant switching
- [ ] Chiptune audio track creation for 8-bit mode
- [ ] Retro visual effects (scanlines, screen curvature)
- [ ] Maintain gameplay clarity and accessibility in pixel style
- [ ] Mobile optimization for pixel art scaling

**Art Style References:**
- Classic arcade space games
- 8-bit console rocket/space themes
- Pixel art best practices for mobile clarity

---



Recent improvements, running log:

- 