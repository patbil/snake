# Snake — Browser Game

A modern implementation of the classic Snake game (originally released in 1976), built with vanilla JavaScript using clean architecture principles. The project demonstrates professional code organization with modular design, event-driven architecture, and separation of concerns.

## Features

- Classic Snake gameplay with modern UI/UX
- Customizable settings — adjust speed, colors, and audio
- Sound effects — immersive audio feedback
- Responsive design — works on different screen sizes
- Score tracking with level progression

---

## Quick Start

This project requires **no build step** — just serve the files with any static server.

### Option 1: Using npx serve

```powershell
npx serve .
```

Then open `http://localhost:3000` in your browser.

### Option 2: Using VS Code Live Server

1. Install the **Live Server** extension in VS Code
2. Right-click on `index.html` and select **"Open with Live Server"**

### Option 3: Using Python

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## Project Structure

```
snake/
├── index.html                      # Main HTML entry point
├── css/
│   ├── main.css                    # Core styles and theme
│   └── modal.css                   # Modal component styles
└── javascript/
    ├── index.js                    # Application entry point
    ├── core/                       
    │   ├── game.js                 # Main game orchestrator
    │   ├── game-bus.js             # Event coordinator (connects all modules)
    │   ├── engine.js               # Game logic (movement, collisions, scoring)
    │   ├── state.js                # Instance-based state manager
    │   └── loop.js                 # Game loop controller
    ├── ui/                         
    │   ├── renderer.js             # Canvas rendering
    │   └── layout.js               # DOM updates
    ├── handlers/                   
    │   └── keydown.js              # Keyboard input handler
    ├── events/                     
    │   ├── event.js                # Event bus
    │   └── events.js               # Event constants
    ├── settings/                   
    │   ├── settings.js             # Settings manager
    │   └── config.js               # Default configuration
    ├── audio/                      
    │   └── audio.js                # Audio manager
    └── @types/                     # JSDoc type definitions
        ├── game.js                 # Main game types
        ├── game-bus.js             # Game bus coordinator types
        ├── engine.js               # Game engine types
        └── ...
```

### Design Principles

- **Separation of Concerns**: Game logic is independent from the DOM
- **Event-Driven Architecture**: Modules communicate via EventBus
- **Factory Pattern**: All modules use `create*` functions for instantiation
- **Type Safety**: Comprehensive JSDoc type definitions (no TypeScript needed)


## Development

### Type Safety with JSDoc

This project uses JSDoc for type checking without TypeScript:

```javascript
/** @typedef {import("../@types/engine.js").GameEngine} GameEngine */

/**
 * @param {GameEngine} engine
 * @returns {void}
 */
function doSomething(engine) {
    // VS Code provides full autocomplete and type checking
}

**Enjoy the game! 🐍🎮**
