# Development Tasks

This file tracks upcoming improvements and fixes for the Liftoff game.
Each issue is grouped by area of the application.

## Setup Screen
- [x] Prevent mobile zoom when focusing numeric fields.
- [x] Preserve player names and dice counts across page refresh.
- [x] Change the count of all dice at once and fix backspace issues on mobile.

## Instructions Modal
- [x] Ensure TL;DR view scrolls to the top when toggled so the content is visible.
- [x] Clean up instructions layout for better readability.

## Game Board
- [x] Remove duplicate label `6/6` in the sixth row.
- [x] Keep player dice section bounded and centered, even with many dice.
- [x] Adjust spacing around rocket body and keep action buttons anchored at the bottom.
- [x] Show a matching rocket image on first load and fade it away.
- [x] Animate removal of extra body rows when entering prelaunch.
- [x] Add an eye-icon toggle to visualize the rocket in picture mode.

## Launch Phase
- [x] Roll one die at a time on the launch modal screen.
- [x] Make the orange Launch button fully opaque when active.

## Success Screen
- [x] Fix layout issues on mobile (header overlap).
- [x] Use the dark space theme like the homepage.
- [x] Correct victory destination logic so Mars isn’t shown for five completed rows.

## Mission Progression
- [x] Change the canvas image as the mission advances:
  1. Phase 1 – Moon Mission.
  2. Phase 2 – Mars Mission.
  3. Phase 3 – Jupiter Mission.
  4. Phase 4 – Saturn Mission.
  5. Phase 5 – Neptune Mission.


