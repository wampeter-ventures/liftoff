# Liftoff Game - TODO List

## 🎯 High Priority Items

### Bugs
- ~~Fix the single player bug. If 1 player, it should still work. Right now it gets stuck in a dead end after first roll.~~
  - ✅ Fixed: Single player mode now properly advances turns and re-rolls dice for the same player after each turn.
- Clear the game state when you go back to the setup screen. Make sure it really clears.
- When the 5th row is built, we still need room for a 6th row for the 6s (the boosters)

### Mobile/PWA Improvements
- ~~Improve touch interactions (tap to place dice as alternative to drag/drop)~~
  - ✅ Implemented: Click/tap to select dice, then click/tap grid slots or fire zone to place them. Works on both mobile and desktop.
- [ ] Test and fix responsive design on various mobile devices
- [ ] Add haptic feedback for mobile devices, if this is possible as a mobile web app, not a native mobile app


### Game Flow & UX
- [ ] Update the game tutorial with a drawer
- [ ] Add confirmation animations for critical actions (send to fire, place dice)
- [ ] Add sound effects and audio feedback

### Visual Polish
- [ ] Enhance dice rolling animations
- [ ] Add particle effects for fire pile and launch
- [ ] Improve rocket launch animation sequence
- [ ] Add visual indicators for victory tiers
- [ ] Better loading states and transitions


## 🔧 Medium Priority Items

### Game Features
- [ ] Add save/load game functionality
- [ ] Implement game statistics tracking like Wordle
- [ ] Add hint system for valid moves
- [ ] Create single-player mode with AI players


### Technical Improvements
- [ ] Add proper error boundaries for React components
- [ ] Implement better state management (consider Redux/Zustand)
- [ ] Add unit tests for game logic
- [ ] Optimize bundle size and loading
- [ ] Add TypeScript definitions


## 🎨 Low Priority Items

### Visual Enhancements
- [ ] Add celebration animations for victories
- [ ] Create custom dice designs/skins
- [ ] Add background space themes

### Social Features
- [ ] Add leaderboards
- [ ] Implement multiplayer matchmaking
- [ ] Add player profiles and achievements
- [ ] Create shareable game results


## 🐛 Bug Fixes & Edge Cases

### Known Issues
- [ ] Test edge cases in rocket grid rendering
- [ ] Verify all placement validation rules work correctly
- [ ] Check fire pile overflow handling
- [ ] Test victory condition calculations
- [ ] Validate booster lock mechanics

### Testing Needed
- [ ] Cross-browser compatibility testing
- [ ] Mobile device testing (iOS/Android)
- [ ] Performance testing with multiple players
- [ ] Edge case testing for game state transitions

## 📝 Documentation & Maintenance

### Documentation
- [ ] Create developer documentation
- [ ] Add inline code comments
- [ ] Write user manual/help system
- [ ] Document game rules clearly in-app

### Code Quality
- [ ] Refactor large components into smaller pieces
- [ ] Standardize naming conventions
- [ ] Add ESLint and Prettier configuration
- [ ] Implement code review guidelines

---

## 🎯 Current Sprint Focus
*Update this section based on current priorities*

**This Sprint:**
- Mobile PWA improvements
- Tutorial system
- Visual polish

**Next Sprint:**
- Save/load functionality
- Statistics tracking
- Performance optimization 