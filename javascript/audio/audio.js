/**
 * Creates the Audio Manager module.
 * Handles sound effects: loading, caching, and playback.
 *
 * @param {import('../types/config').AudioConfig} audioSettings - Sound configuration (volume, enabled, sound paths).
 * @returns {import('../types/audio').AudioManagerPublicAPI} Public interface for controlling audio playback.
 */
export function createAudioManager(audioSettings) {
    const audioCache = {};

    /**
     * Loads and caches an Audio object.
     * @param {string} path - Path to the audio file.
     * @returns {HTMLAudioElement} The cached or newly created Audio element.
     */
    function loadAudio(path) {
        if (audioCache[path]) return audioCache[path];

        const audio = new Audio(path);
        audio.volume = audioSettings.volume;
        audioCache[path] = audio;
        return audio;
    }

    /**
     * Plays a specific sound effect by key.
     * @param {keyof Omit<import('../types/config').AudioConfig, 'enabled' | 'volume'>} soundName - The sound key.
     */
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
