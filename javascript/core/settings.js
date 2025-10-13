import { setNestedValue } from "../utils/nested-value.js";

export function createSettingsManager(defaultConfig) {
    const settingsKey = "snakeGameSettings";
    const settings = { ...defaultConfig };
    const configurableKeys = [
        "initialSegmentCount",
        "initialSpeed",
        "maxSpeed",
        "levelStep",
        "speedStep",
        "sound.enabled",
        "sound.volume",
        "colors.snake",
        "colors.apple",
        "colors.background",
    ];

    function getSettings() {
        return settings;
    }

    function loadSettings() {
        const stored = localStorage.getItem(settingsKey);
        if (stored) {
            const loadedSettings = JSON.parse(stored);
            configurableKeys.forEach((key) => {
                const value = loadedSettings[key];
                if (value !== undefined) {
                    setNestedValue(settings, key, value);
                }
            });
        }

        return settings;
    }

    function saveSettings(newSettings) {
        const settingsToSave = {};
        configurableKeys.forEach(
            (key) => (settingsToSave[key] = newSettings[key] || settings[key])
        );
        localStorage.setItem(settingsKey, JSON.stringify(settingsToSave));
    }

    return { getSettings, loadSettings, saveSettings, defaultConfig };
}
