# Wolf Level Plan

1. Trigger: After victory level 10 (Eris) shown in GameResults.
2. GameResults will show a button to continue to the secret "Wolf" level.
3. startWolfLevel():
   - Set gameState to 'wolf'.
   - Create single player with 6 dice.
   - Prefill rocketGrid with all body rows (1-5) complete; row 6 empty.
   - Reset firePile, boosterRowLocked false, rocketHeight 5.
4. Gameplay in wolf state:
   - Same placement rules; only one player rolls 6 dice.
   - Only one launch attempt allowed (track wolfLaunchAttempted).
   - Visual theme: use existing StarryBackground with dark overlay.
5. attemptLaunch():
   - If gameState is 'wolf', set wolfOutcome to 'success' if any 6s rolled or 'fail' otherwise.
   - Always set wolfLaunchAttempted true.
   - After countdown, show modal then transition to 'wolf_results'.
6. GameResults updated:
   - Accept onWolfStart prop to start secret level.
   - When wolfOutcome provided, display custom text for success/fail.
   - When victoryLevel === 10, show button to trigger onWolfStart.
