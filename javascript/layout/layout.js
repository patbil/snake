/**
 * Creates the Layout Manager module.
 * @param {object} settingsCallbacks - An object containing callback functions for settings persistence.
 * @param {function(): object} settingsCallbacks.getConfig - Function to get the current config object.
 * @param {function(object): void} settingsCallbacks.onSave - Function to call when settings are saved.
 * @param {function(): object} settingsCallbacks.onReset - Function to call when settings are reset to default.
 * @returns {object} The public interface for interacting with the game layout.
 */
export function createLayoutManager({ getConfig, onOpen, onSave, onReset }) {
    const elements = getElements();
    const initialConfig = getConfig();

    /**
     * Gathers and caches references to all necessary DOM elements.
     * @returns {object} An object containing references to the elements.
     */
    function getElements() {
        return {
            usernameDisplay: document.getElementById("username"),
            scoreDisplay: document.getElementById("score"),
            levelDisplay: document.getElementById("level"),
            usernameModal: document.getElementById("usernameModal"),
            settingsModal: document.getElementById("settingsModal"),
            settingsButton: document.getElementById("settings"),
            userNameInput: document.getElementById("userNameInput"),
            startGameButton: document.getElementById("startGameButton"),
            usernameError: document.getElementById("usernameError"),
            saveSettingsButton: document.getElementById("saveSettingsButton"),
            resetSettingsButton: document.getElementById("resetSettingsButton"),
        };
    }

    /**
     * Shows the username input modal and waits for a validated username input.
     * @returns {Promise<string>} A Promise that resolves with the validated username string.
     */
    function showUsernameModal() {
        elements.usernameError.style.color = initialConfig.colors.error;

        return new Promise((resolve) => {
            const handleStart = () => {
                const username = elements.userNameInput.value.trim();
                if (username.length < 2) {
                    elements.usernameError.textContent =
                        "Name must be at least 2 characters long!";
                    elements.usernameError.style.display = "block";
                    return;
                }

                elements.usernameError.style.display = "none";
                elements.usernameModal.style.display = "none";

                elements.startGameButton.removeEventListener(
                    "click",
                    handleStart
                );
                elements.userNameInput.removeEventListener(
                    "keydown",
                    handleKeydown
                );

                resolve(username);
            };

            const handleKeydown = (e) => {
                if (e.key === "Enter") handleStart();
            };

            elements.usernameModal.style.display = "flex";
            elements.startGameButton.addEventListener("click", handleStart);
            elements.userNameInput.addEventListener("keydown", handleKeydown);
            elements.userNameInput.focus();
        });
    }

    /**
     * Fills the settings modal fields with the current configuration values.
     * @param {object} config - The configuration object to load into the fields.
     */
    function syncSettingsToModal(config) {
        document
            .querySelectorAll("#settingsModal [data-config]")
            .forEach((input) => {
                const path = input.dataset.config;

                let value;
                if (path.includes(".")) {
                    const [parentKey, childKey] = path.split(".");
                    value = config[parentKey]?.[childKey];
                } else {
                    value = config[path];
                }

                if (input.type === "checkbox") {
                    input.checked = value;
                } else {
                    input.value = value;
                }
            });
    }

    /**
     * Gathers current values from the settings modal and passes them to the onSave callback.
     */
    function handleSettingsSave() {
        const newSettings = getConfig();

        document
            .querySelectorAll("#settingsModal [data-config]")
            .forEach((input) => {
                const path = input.dataset.config;
                let value;

                if (input.type === "checkbox") {
                    value = input.checked;
                } else if (input.type === "number") {
                    value = parseInt(input.value);
                } else {
                    value = input.value;
                }

                if (path.includes(".")) {
                    const [parentKey, childKey] = path.split(".");
                    if (!newSettings[parentKey]) newSettings[parentKey] = {};
                    newSettings[parentKey][childKey] = value;
                } else {
                    newSettings[path] = value;
                }
            });

        onSave(newSettings);
        elements.settingsModal.style.display = "none";
    }

    /**
     * Handles resetting settings to default values.
     */
    function handleSettingsReset() {
        if (
            !confirm("Are you sure you want to reset all settings to default?")
        ) {
            return;
        }

        const resetConfig = onReset();
        syncSettingsToModal(resetConfig);
    }

    /**
     * Shows the settings modal and initializes fields with current config.
     */
    function showSettingsModal() {
        onOpen();
        syncSettingsToModal(getConfig());
        elements.settingsModal.style.display = "flex";
    }

    function setScore(score) {
        if (elements.scoreDisplay) elements.scoreDisplay.textContent = score;
    }

    function setLevel(level) {
        if (elements.levelDisplay) elements.levelDisplay.textContent = level;
    }

    function setUsername(username) {
        if (!username) return;
        if (elements.usernameDisplay)
            elements.usernameDisplay.textContent = `👤${username}`;
        localStorage.setItem("username", username);
    }

    function togglePause(pause) {}

    function gameOver(snapshot) {
        setLevel(snapshot.level);
        setScore(snapshot.score);
    }

    if (elements.settingsButton) {
        elements.settingsButton.addEventListener("click", showSettingsModal);
    }

    if (elements.saveSettingsButton) {
        elements.saveSettingsButton.addEventListener(
            "click",
            handleSettingsSave
        );
    }

    if (elements.resetSettingsButton) {
        elements.resetSettingsButton.addEventListener(
            "click",
            handleSettingsReset
        );
    }

    return {
        setLevel,
        setScore,
        setUsername,
        togglePause,
        gameOver,
        showUsernameModal,
        showSettingsModal,
    };
}
