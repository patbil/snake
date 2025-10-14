/**
 * Creates the Layout Manager module.
 * This module is responsible for direct manipulation of the DOM.
 *
 * @param {object} settingsCallbacks - An object containing callback functions for settings persistence and game control.
 * @param {function(): object} settingsCallbacks.getSettings - Function to get the current settings object.
 * @param {function(string): void} settingsCallbacks.onOpen - Function to call when a modal is opening (e.g., to pause the game).
 * @param {function(object): void} settingsCallbacks.onSave - Function to call when settings are saved.
 * @param {function(): object} settingsCallbacks.onReset - Function to call when settings are reset to default.
 * @param {function(): void} settingsCallbacks.onRestart - Function to call when the game needs to be restarted.
 * @returns {object} The public interface for interacting with the game layout.
 */
export function createLayoutManager({
    getSettings,
    onOpen,
    onSave,
    onReset,
    onRestart,
}) {
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
            pauseElements: document.getElementById("pauseElements"),
            gameoverElements: document.getElementById("gameoverElements"),
            restartButton: document.getElementById("restartButton"),
            finalLevel: document.getElementById("finalLevel"),
            finalScore: document.getElementById("finalScore"),
        };
    }

    function toggleElementVisibility(htmlElement, isVisible, style = "flex") {
        if (htmlElement) {
            htmlElement.style.display = isVisible ? style : "none";
        }
    }

    function getValueFromPath(obj, path) {
        return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    }

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
        toggleElementVisibility(elements.settingsModal, false);
    }

    function handleSettingsReset() {
        if (
            confirm("Are you sure you want to reset all settings to default?")
        ) {
            onReset();
        }
    }

    function handleRestartGame() {
        onRestart();
    }

    function attachEventListeners() {
        if (elements.settingsButton) {
            elements.settingsButton.addEventListener(
                "click",
                showSettingsModal
            );
        }

        if (elements.restartButton) {
            elements.restartButton.addEventListener("click", handleRestartGame);
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
                    toggleElementVisibility(
                        elements.usernameError,
                        true,
                        "block"
                    );
                    return;
                }

                toggleElementVisibility(elements.usernameError, false);
                elements.startGameButton.removeEventListener(
                    "click",
                    handleStart
                );
                elements.userNameInput.removeEventListener(
                    "keydown",
                    handleKeydown
                );

                toggleElementVisibility(elements.usernameModal, false);
                resolve(username);
            };

            const handleKeydown = (e) => {
                if (e.key === "Enter") handleStart();
            };

            toggleElementVisibility(elements.usernameModal, true);
            elements.startGameButton.addEventListener("click", handleStart);
            elements.userNameInput.addEventListener("keydown", handleKeydown);
            elements.userNameInput.focus();
        });
    }

    function showSettingsModal() {
        onOpen("settings");
        syncSettingsToModal(getSettings());
        toggleElementVisibility(elements.settingsModal, true);
    }

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

    function resetAll() {
        setLevel(0);
        setScore(0);
        toggleElementVisibility(elements.pauseElements, false);
        toggleElementVisibility(elements.gameoverElements, false);
        toggleElementVisibility(elements.stateModal, false);
        toggleElementVisibility(elements.usernameModal, false);
        toggleElementVisibility(elements.settingsModal, false);
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
        toggleElementVisibility(elements.stateModal, isPaused);
        toggleElementVisibility(elements.pauseElements, isPaused, "block");
    }

    function gameOver(snapshot) {
        toggleElementVisibility(elements.stateModal, true);
        toggleElementVisibility(elements.gameoverElements, true, "block");
        elements.finalLevel.textContent = snapshot.level;
        elements.finalScore.textContent = snapshot.score;
    }

    attachEventListeners();

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
