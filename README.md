# Snake — Browser Game

A simple implementation of the classic Snake game (originally released in 1976), built for the web using HTML, CSS, and JavaScript. The project is intentionally modular: core game logic, rendering, input and layout are separated so the code is easier to test and maintain.

---

## Quick start (local)

This project does not require a build step. Serve the files with a static server and open the page in your browser.

1. Clone the repository:

```bash
git clone <repo-url>
cd snake
```

2. Start a static server (for example via `npx serve` or VS Code Live Server):

```powershell
npx serve .
# or use Live Server in VS Code
```

3. Open the address provided by the server (for example `http://localhost:5000`).

---

## Project structure (overview)

- `index.html` — main HTML file
- `css/` — styles (main theme and modal styles)
- `javascript/index.js` — entry point
- `javascript/core/` — core game modules
  - `config.js` — game configuration (grid size, speed, colors)
  - `state.factory.js` — an instance-based state manager
  - `engine.js` — game logic (movement, collisions, scoring)
  - `renderer.js` — drawing the game state to a canvas
  - `loop.js` — game loop controller (start/stop/setSpeed)
  - `input.js` — keyboard input / input adapter
- `javascript/layout/` — DOM updates (score, level, settings modal)

Design principle: keep game logic independent from the DOM. The engine produces snapshots/events; renderer and layout subscribe and update the UI.

---

## Development notes

- Run the game with a local static server (see Quick start).
- When adding features, prefer adding them to `javascript/core/` as modular units: keep logic in `engine`, drawing in `renderer`, and avoid DOM access from `core` modules.
- Prefer instance-based state (the `state.factory.js`) over a global singleton — it simplifies unit testing.

---

## Suggested next improvements

- Replace `setInterval` loop with a `requestAnimationFrame` fixed timestep loop to improve pause control and timing stability.
- Add `togglePause()` to engine and wire the space key to it.
- Add unit tests (Vitest/Jest) for engine behaviors (movement, apple eating, tail trimming).
