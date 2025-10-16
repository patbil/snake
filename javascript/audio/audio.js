/** @typedef {import('../@types/config').AudioConfig} AudioConfig */
/** @typedef {import('../@types/audio').AudioManager} AudioManager */

/**
 * Creates the Audio Manager module.
 * Handles sound effects: loading, caching, and playback.
 *
 * @param {AudioConfig} audioSettings - Sound configuration (volume, enabled, sound paths).
 * @returns {AudioManager} Public interface for controlling audio playback.
 */
export function createAudioManager(audioSettings) {
    const audioCache = {};

    function loadAudio(path) {
        if (audioCache[path]) return audioCache[path];

        const audio = new Audio(path);
        audio.volume = audioSettings.volume;
        audioCache[path] = audio;
        return audio;
    }

    function play(soundName) {
        if (!audioSettings.enabled) return;

        const path = audioSettings[soundName];
        if (!path) return;

        const audio = loadAudio(path);
        audio.currentTime = 0;
        audio.play().catch((e) => {
            if (e.name !== "NotAllowedError") {
                console.error(`Audio playback failed for '${soundName}':`, e);
            }
        });
    }

    return { play };
}
