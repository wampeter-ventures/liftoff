# Liftoff Game - TODO List

## 🎯 High Priority Items

### Bugs and Tweaks

- oops, new bug introduced, i think when we did the click-to-place: now dragging and dropping on mobile isn't working. fix!

- Clear the game state when you go back to the setup screen. Make sure it really clears. right now it doesnt.


- When the 5th row is built, we still need room for a 6th row for the 6s (the boosters)

- 💨 FIZZLE! FAIL! 💥 wait on this header til the dice are done rolling


- on a failed launch it should not give you your dice back! it should put one of hte dice into the fire, then advance to the next person's turn. check that is happening

- Put instructions on popup drawer, re-initiated with a click on a ? on the top right

- Animate the moment where you remove the excess rocket body rows when you add a six and move on to the launch phase. We want the user to see that those rows get crossed out then fade away and the sixes animate as they slide  up. 

- Add a better launch screen that has Dice rolling and clarity about the fact that you’re hoping to roll a six rolling one die at a time.  For example, one idea for that: At launch, Animate the rocket moving, then the 6s rolling one by one, and if they all sputter out and don't achieve a single 6, then the rocket touches back down, but if one of the boosters is indeed a 6, then we celebrate the launch, and the rocket takes off and flies up and off the page. 

- when everyone runs out of dice, check if they can do a Launch, and if not, then auto-advance to the final screen, with a special new case for "ran out of parts while building" using the epxloding kittens style language


## Strategic

- Figure out how to create more choice, more risk, more tradeoffs, more long term planning


### Game Flow & UX

- Let the rocket grow as big as the user wants, no limit on 5 levels. Create placeholder success copy states for 50 levels


- Change the canvas when you get to phase 2 (first booster placed)
- Change again when you get to phase 3 (complete body, still building boosters)
- Change again when you get to phase 4 (complete body and complete boosters)


- [ ] Add confirmation animations for critical actions (send to fire, place dice)
- [ ] Add sound effects and audio feedback
- default to 3 players on the setup screen, not one player

### Visual Polish


- upgrade the launch success page so it is clearer what level you achieved, maybe like it animates you getting past the planet levels and arriving to the planet level you got to. also it's duplicating the "row" thing and the booster thing by showing 6s in the body rows accidentally.

- handle the top row for when there are tons of players that spill too wide

- [ ] Enhance dice rolling animations
- [ ] Improve rocket launch animation sequence

- try this https://www.8bitcn.com/



### Game Features
- [ ] Implement game statistics tracking like Wordle



## Things to Organize


- Add a toggle that lets you visualize the rocket in picture mode

- Add special features that let you build different rocket ships



### Mobile/PWA Improvements

- [ ] Test and fix responsive design on various mobile devices
- [ ] Add haptic feedback for mobile devices, if this is possible as a mobile web app, not a native mobile app




### Technical Improvements
- [ ] Add proper error boundaries for React components
- [ ] Implement better state management (consider Redux/Zustand)
- [ ] Add unit tests for game logic



## 🎨 Low Priority Items

### Visual Enhancements
- [ ] Add celebration animations for victories
- [ ] Create custom dice designs/skins

### Social Features
- [ ] Add leaderboards
- [ ] Add player profiles and achievements
- [ ] Create shareable game results



