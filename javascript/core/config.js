/**
 * Global Configuration Settings for the Snake Game Engine.
 * This object centralizes all core constants, dimensions, speed modifiers, and colors.
 */
export const config = {
    /** The number of units (blocks) along one edge of the square grid (e.g., 25x25). */
    gridSize: 25,
    /** The initial number of segments the snake starts with. */
    initialSegmentCount: 5,
    /** The initial speed/interval of the game loop in milliseconds. */
    initialSpeed: 100,
    /** The minimum possible interval (maximum speed) in milliseconds. */
    maxSpeed: 30,
    /** The score required to advance one level. */
    levelStep: 2,
    /** The amount by which speed decreases (interval decreases) per level step in milliseconds. */
    speedStep: 10,
    /** Configuration settings for the audio manager */
    sound: {
        enabled: true,
        volume: 0.02,
        eat: "assets/sound/collect.mp3",
        gameover: "assets/sound/game-over.mp3",
        levelup: "assets/sound/level-up.mp3",
    },
    /** Defines the colors used for rendering the game elements. */
    colors: {
        snake: "red",
        apple: "green",
        background: "black",
        gridLine: "#333333",
    },
};
