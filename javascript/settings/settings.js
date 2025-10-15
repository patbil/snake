import { config } from "./config.js";

/** @typedef {import('../@types/settings.js').SettingsManagerPublicAPI} SettingsManagerPublicAPI */

/**
 * Creates the Settings Manager module.
 * Manages loading, storing, and accessing the game configuration,
 * persisting configurable options to the browser's localStorage.
 *
 * @returns {SettingsManagerPublicAPI} The public interface for managing settings.
 */
export function createSettingsManager() {
    const settings = structuredClone(config);
    const settingsKey = "snakeGameSettings";
    const configurableKeys = [
        "initialSegmentCount",
        "initialSpeed",
        "maxSpeed",
        "levelStep",
        "speedStep",
        "audio.enabled",
        "audio.volume",
        "colors.snake",
        "colors.apple",
        "colors.background",
    ];

    function getSettings() {
        return settings;
    }

    function restoreSettings() {
        configurableKeys.forEach((key) => {
            const defaultValue = key.includes(".")
                ? key.split(".").reduce((acc, k) => acc[k], config)
                : config[key];
            setNestedValue(settings, key, defaultValue);
        });

        localStorage.removeItem(settingsKey);
    }

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

    function loadSettings() {
        const stored = localStorage.getItem(settingsKey);
        if (stored) {
            const loadedSettings = JSON.parse(stored);
            configurableKeys.forEach((key) => {
                const value = loadedSettings[key];
                if (value !== undefined) setNestedValue(settings, key, value);
            });
        }
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
        saveSettings,
        restoreSettings,
        defaultConfig: structuredClone(config),
    };
}
