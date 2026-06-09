# Digital Euro Challenge – v5c robust start fix

This version is specifically built so that **Start quiz always works**, even if Firebase is not configured yet or external module imports fail.

## Why the previous version could fail
The earlier Firebase versions still depended on JavaScript modules loading successfully before any button handler could run. If a module import failed, the whole script stopped and the Start button no longer reacted.

## What changed in v5c
- Uses a normal deferred script instead of a module script for the core quiz flow
- Loads Firebase lazily in the background via dynamic import
- Core quiz start logic is available immediately
- Pressing Enter in the name field also starts the quiz
- 30 seconds per question
- Leaderboard submission still works once Firebase values are configured

## Files to upload
- index.html
- style.css
- app.js
- firebase-database-rules.json
- README.md

## Firebase values
Edit the placeholder values at the top of app.js.

## If leaderboard page is needed
This package focuses on the robust quiz flow. If you also want a separate leaderboard page, reuse the previous leaderboard file after the quiz itself is working.
