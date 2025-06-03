# Liftoff Game - TODO List

## 🎯 High Priority Items

### Bugs

- Clear the game state when you go back to the setup screen. Make sure it really clears. right now it doesnt.
- When the 5th row is built, we still need room for a 6th row for the 6s (the boosters)
- on a failed launch it should not give you your dice back! it should put one of hte dice into the fire, then advance to the next person's turn. check that is happening
- handle the top row for when there are tons of players that spill too wide

### Mobile/PWA Improvements

- [ ] Test and fix responsive design on various mobile devices
- [ ] Add haptic feedback for mobile devices, if this is possible as a mobile web app, not a native mobile app


### Game Flow & UX
- [ ] Update the game tutorial with a drawer
- [ ] Add confirmation animations for critical actions (send to fire, place dice)
- [ ] Add sound effects and audio feedback
- default to 3 players on the setup screen, not one player

### Visual Polish
- upgrade all the modal alerts to be more natively integrated not browser alerts, like "You must place at least one die or send unused dice to the fire pile." and "Launch SUCCESS! Booster rolls"

- upgrade the launch success page so it is clearer what level you achieved, maybe like it animates you getting past the planet levels and arriving to the planet level you got to. also it's duplicating the "row" thing and the booster thing by showing 6s in the body rows accidentally.

- [ ] Enhance dice rolling animations
- [ ] Add particle effects for fire pile and launch
- [ ] Improve rocket launch animation sequence
- [ ] Add visual indicators for victory tiers
- [ ] Better loading states and transitions

- try this https://www.8bitcn.com/


## Things to Organize

- Put instructions on popup drawer, re-initiated with a click on a ? on the top right


- Animate the moment where you remove the excess rocket body rows when you add a six and move on to the launch phase. We want the user to see that those rows get crossed out then fade away and the sixes animate as they slide  up. 

- Add a better launch screen that has Dice rolling and clarity about the fact that you’re hoping to roll a six rolling one die at a time 



- Change the canvas when you get to phase 2 (first booster placed)
- Change again when you get to phase 3 (complete body, still building boosters)
- Change again when you get to phase 4 (complete body and complete boosters)




- At launch, Animate the rocket moving then the 6s rolling one by one, and if they all sputter out, then the rocket touches back down, but if one is a 6, then the rocket takes off and flies up and off the page.



- Add a toggle that lets you visualize the rocket in picture mode
- Add special features that let you build different rocket ships



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