/**
 * Global configuration settings for the Snake Game Engine.
 * This object centralizes all core constants, canvas dimensions, speed modifiers, and colors.
 * @type {import('../types/config').GameConfig}
 */
export const config = Object.freeze({
    initialSegmentCount: 5,
    initialSpeed: 100,
    maxSpeed: 30,
    levelStep: 5,
    speedStep: 5,
    canvas: {
        size: 770,
        grid: 35,
    },
    audio: {
        enabled: true,
        volume: 0.02,
        eat: "assets/sound/collect.mp3",
        gameover: "assets/sound/game-over.mp3",
        levelup: "assets/sound/level-up.mp3",
    },
    colors: {
        snake: "#FF0000",
        apple: "#008000",
        background: "#000000",
        gridLine: "#333333",
    },
});
