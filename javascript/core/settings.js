import { config } from "./config.js";

/**
 * Creates the Settings Manager module.
 * It manages loading, storing, and accessing the game configuration, persisting configurable options to the browser's localStorage.
 * @returns {object} The public interface for managing settings.
 */
export function createSettingsManager() {
    const settingsKey = "snakeGameSettings";
    const settings = structuredClone(config);
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

    /**
     * Returns the currently active settings object.
     * @returns {object} The current settings, merged with defaults.
     */
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

    /**
     * Saves the subset of settings to localStorage.
     * @param {object} newSettings - An object containing the new setting values.
     */
    function saveSettings(newSettings) {
        const settingsToSave = {};
        configurableKeys.forEach((key) => {
            if (newSettings[key] !== undefined) {
                settingsToSave[key] = newSettings[key];
                setNestedValue(settings, key, newSettings[key]);
            }
        });

        localStorage.setItem(settingsKey, JSON.stringify(settingsToSave));
    }

    function setNestedValue(obj, path, value) {
        const parts = path.split(".");
        let current = obj;
        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                current[part] = value;
            } else {
                if (!current[part] || typeof current[part] !== "object") {
                    current[part] = {};
                }
                current = current[part];
            }
        });
    }

    loadSettings();

    return {
        getSettings,
        loadSettings,
        saveSettings,
        defaultConfig: structuredClone(config),
    };
}
