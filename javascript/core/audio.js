/**
 * Creates the Audio Controller module.
 * This controller manages sound effects based on events emitted by the State Manager.
 *
 * @param {object} settings - settingsuration object containing sound settings and paths.
 * @returns {object} The public interface for initializing and playing sounds.
 */
export function createAudioManager(settings) {
    const audioCache = {};
    const volume = settings.sound.volume;

    function loadAudio(path) {
        if (audioCache[path]) return audioCache[path];
        const audio = new Audio(path);
        audio.volume = volume;
        audioCache[path] = audio;
        return audio;
    }

    /**
     * Plays a specific sound effect.
     * @param {string} soundName - The name of the sound.
     */
    function play(soundName) {
        if (!settings.sound.enabled) return;

        const path = settings.sound[soundName];
        if (!path) return;

        const audio = loadAudio(path);
        audio.currentTime = 0;
        audio.play().catch((e) => console.error("Audio playback failed:", e));
    }

    return { play };
}
