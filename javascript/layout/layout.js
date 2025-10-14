/**
 * Creates the Layout Manager module.
 * This module is responsible for direct manipulation of the DOM.
 *
 * @param {object} settingsCallbacks - An object containing callback functions for settings persistence.
 * @param {function(): object} settingsCallbacks.getSettings - Function to get the current settings object.
 * @param {function(string): void} settingsCallbacks.onOpen - Function to call when a modal is opening.
 * @param {function(object): void} settingsCallbacks.onSave - Function to call when settings are saved.
 * @param {function(): object} settingsCallbacks.onReset - Function to call when settings are reset to default.
 * @returns {object} The public interface for interacting with the game layout.
 */
export function createLayoutManager({ getSettings, onOpen, onSave, onReset }) {
    const elements = getElements();

    function getElements() {
        return {
            usernameDisplay: document.getElementById("username"),
            scoreDisplay: document.getElementById("score"),
            levelDisplay: document.getElementById("level"),
            stateModal: document.getElementById("stateModal"),
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

    function toggleModalVisibility(modalElement, isVisible) {
        if (modalElement) {
            modalElement.style.display = isVisible ? "flex" : "none";
        }
    }

    function getValueFromPath(obj, path) {
        return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    }

    /**
     * Shows the username input modal and waits for a validated username input.
     * @returns {Promise<string>} A Promise that resolves with the validated username string.
     */
    function showUsernameModal() {
        onOpen("username");

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
                toggleModalVisibility(elements.usernameModal, false);

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

            toggleModalVisibility(elements.usernameModal, true);
            elements.startGameButton.addEventListener("click", handleStart);
            elements.userNameInput.addEventListener("keydown", handleKeydown);
            elements.userNameInput.focus();
        });
    }

    function showSettingsModal() {
        onOpen("settings");
        syncSettingsToModal(getSettings());
        toggleModalVisibility(elements.settingsModal, true);
    }
    /**
     * Fills the settings modal fields with the current configuration values.
     * @param {object} settings - The configuration object to load into the fields.
     */
    function syncSettingsToModal(settings) {
        document
            .querySelectorAll("#settingsModal [data-config]")
            .forEach((input) => {
                const path = input.dataset.config;
                const value = getValueFromPath(settings, path);

                if (input.type === "checkbox") {
                    input.checked = value;
                } else {
                    input.value = value;
                }
            });
    }

    /**
     * Gathers current values from the settings modal and passes them to the onSave callback.
     * The settings are gathered as a flat object (using dot-notation keys).
     */
    function handleSettingsSave() {
        const settingsToSave = {};

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

                settingsToSave[path] = value;
            });

        onSave(settingsToSave);
        toggleModalVisibility(elements.settingsModal, false);
    }

    /**
     * Handles resetting settings to default values.
     */
    function handleSettingsReset() {
        if (
            confirm("Are you sure you want to reset all settings to default?")
        ) {
            onReset();
            toggleModalVisibility(elements.settingsModal, false);
        }
    }

    function resetAll() {

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

    function togglePause(isPaused) {
        // Logika wyświetlania pauzy (teraz obsługiwana przez modalManager z zewnętrznego modułu)
        // W tym module layoutManager może dodawać/usuwać klasę 'game-paused' z body/canvas.
    }

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
        resetAll,
        showUsernameModal,
        showSettingsModal,
    };
}
