# Libraries used in this game

[chessground](https://github.com/lichess-org/chessground) - for displaying the board and user interaction with it

[chess.js](https://github.com/jhlywa/chess.js/tree/master) - for generating moves and checking for check/checkmate/stalemate

[js-chess-engine](https://github.com/josefjadrny/js-chess-engine) - for the computer player

Other tools:

[Chess FEN Viewer](https://www.dailychess.com/chess/chess-fen-viewer.php) - create test scenarios

# Roadmap

1. Allow choosing what piece to promote to
2. Display the pieces that have been captured so far
3. Option to resign (currently player has to leave or restart game)
4. Switch to PGN format so we can detect threefold repitition
5. Save progress, so player can come back later and finish game
6. Timed games
7. Ranked games (both players would opt-in) and track Elo rating (think this requires timed games so player can't just stall when losing)
8. Use a better chess engine for the computer player (maybe [stockfish.js](https://github.com/nmrugg/stockfish.js)?)
9. Save a history of games played, allow the player to step through a played game move-by-move for analysis

# Getting Started with Dusk

### `npm run dev`

Runs the game in Dev UI.

The page will reload when you make changes.

### `npm run upload`

Builds the game and starts upload process to Dusk.

### `npm run build`

Builds the game. You can then upload it to Dusk using `npx dusk-cli@latest upload`.

### `npm run lint`

Runs the validation rules. You can read about them in the [docs on server-side logic](https://developers.dusk.gg/docs/advanced/server-side-logic).

### `npm run typecheck`

Verifies that TypeScript is valid.

## Learn More

See the [Dusk docs](https://developers.dusk.gg/docs/quick-start) for more info. You can also ask any questions in the [Dusk Discord](https://discord.gg/rune-devs), we're happy to help!
