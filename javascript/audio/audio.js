/**
 * @typedef {import('./config').SoundConfig} SoundConfig - Importuje typ konfiguracji dźwięku.
 */

/**
 * @typedef {object} AudioManagerPublicAPI
 * @property {function(keyof Omit<SoundConfig, 'enabled' | 'volume'>): void} play - Plays a specific sound effect.
 */

/**
 * Creates the Audio Controller module.
 * This controller manages sound effects, handling loading, caching, and playback.
 *
 * @param {object} settings - Configuration object (expected to be the global config object).
 * @param {SoundConfig} settings.sound - The sound configuration subset.
 * @returns {AudioManagerPublicAPI} The public interface for controlling sound playback.
 */
export function createAudioManager(settings) {
    const audioCache = {};

    // settings.sound.volume jest teraz bezpiecznie typowane jako number
    const volume = settings.sound.volume;

    /**
     * Internal function to load and cache the Audio object.
     * @param {string} path - The file path to the audio resource.
     * @returns {HTMLAudioElement} The cached or newly created Audio object.
     */
    function loadAudio(path) {
        if (audioCache[path]) return audioCache[path];
        const audio = new Audio(path);
        audio.volume = volume;
        audioCache[path] = audio;
        return audio;
    }

    /**
     * Plays a specific sound effect identified by its key in the settings.
     *
     * @param {keyof Omit<SoundConfig, 'enabled' | 'volume'>} soundName - The key (name) of the sound defined in the settings object (e.g., "eat", "gameover", "levelup").
     * @returns {void}
     */
    function play(soundName) {
        if (!settings.sound.enabled) return;

        const path = settings.sound[soundName]; // Edytor wie, że soundName to klucz SoundConfig
        if (!path) {
            return;
        }

        const audio = loadAudio(path);
        audio.currentTime = 0; // Rewind to start
        audio
            .play()
            .catch((e) =>
                console.error(`Audio playback failed for '${soundName}':`, e)
            );
    }

    return {
        play,
    };
}
