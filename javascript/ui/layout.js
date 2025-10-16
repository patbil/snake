import { EVENTS } from "../events/events.js";

/** @typedef {import('../@types/config.js').GameConfig} GameConfig */
/** @typedef {import('../@types/event.js').EventBus} EventBus */
/** @typedef {import('../@types/layout.js').LayoutManager} LayoutManageLayoutManagerrPublicAPI */

/**
 * Creates the Layout Manager module.
 * Responsible for direct DOM manipulation and managing UI state.
 *
 * @param {GameConfig} settings - The initial or current game settings object.
 * @param {EventBus} eventBus - Event Bus instance for module communication.
 * @returns {LayoutManager} The public interface for interacting with the game layout.
 */
export function createLayoutManager(eventBus, settings) {
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
            usernameInput: document.getElementById("usernameInput"),
            startGameButton: document.getElementById("startGameButton"),
            usernameError: document.getElementById("usernameError"),
            saveSettingsButton: document.getElementById("saveSettingsButton"),
            resetSettingsButton: document.getElementById("resetSettingsButton"),
            pauseElements: document.getElementById("pauseElements"),
            gameOverElements: document.getElementById("gameOverElements"),
            restartButton: document.getElementById("restartButton"),
            finalLevel: document.getElementById("finalLevel"),
            finalScore: document.getElementById("finalScore"),
            leaderboardElement: document.querySelector(".leaderboard ul"),
        };
    }

    function toggleElementVisibility(htmlElement, isVisible, style = "flex") {
        if (htmlElement) htmlElement.style.display = isVisible ? style : "none";
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function showLeaderboardError(message = "Failed to load scores") {
        if (!elements.leaderboardElement) return;
        elements.leaderboardElement.innerHTML = `<li class="error">${escapeHtml(
            message
        )}</li>`;
    }

    function renderLeaderboard(scores) {
        if (!scores || scores.length === 0) {
            elements.leaderboardElement.innerHTML =
                '<li class="empty">No scores yet. Be the first!</li>';
            return;
        }

        elements.leaderboardElement.innerHTML = scores
            .map((entry, index) => getLeaderboardEntry(entry, index))
            .join("");
    }

    function getLeaderboardEntry(entry, index) {
        const medal = getMedal(index);
        const date = formatDate(entry.timestamp);

        const entryHtml = `
                    <li class="leaderboard-entry ${
                        entry.username === localStorage.getItem("username")
                            ? "current-user"
                            : ""
                    }" data-rank="${index + 1}">
                        <span class="rank">${medal || `#${index + 1}`}</span>
                        <div class="player-info">
                            <strong class="username">${escapeHtml(
                                entry.username
                            )}</strong>
                            <span class="level">Level ${entry.level}</span>
                        </div>
                        <div class="score-info">
                            <span class="score">${entry.score}</span>
                            <span class="date">${date}</span>
                        </div>
                    </li>
                `;

        return entryHtml;
    }

    function showUsernameModal() {
        eventBus.emit(EVENTS.UI.OPEN_MODAL, { type: "username" });

        return new Promise((resolve) => {
            const handleStart = () => {
                const username = elements.usernameInput.value.trim();
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
                elements.usernameInput.removeEventListener(
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
            elements.usernameInput.addEventListener("keydown", handleKeydown);
            elements.usernameInput.focus();
        });
    }

    function showSettingsModal() {
        eventBus.emit(EVENTS.UI.OPEN_MODAL, { type: "settings" });
        syncSettingsToModal(settings);
        toggleElementVisibility(elements.settingsModal, true);
    }

    function handleSettingsReset() {
        if (
            confirm("Are you sure you want to reset all settings to default?")
        ) {
            eventBus.emit(EVENTS.UI.SETTINGS.RESET);
        }
    }

    function syncSettingsToModal(settings) {
        document
            .querySelectorAll("#settingsModal [data-config]")
            .forEach((input) => {
                const path = input.dataset.config;
                const value = getValueFromPath(settings, path);
                if (input.type === "checkbox") input.checked = value;
                else input.value = value;
            });
    }

    function handleSettingsSave() {
        const settingsToSave = {};
        document
            .querySelectorAll("#settingsModal [data-config]")
            .forEach((input) => {
                const path = input.dataset.config;
                let value;

                if (input.type === "checkbox") value = input.checked;
                else if (input.type === "number") value = parseInt(input.value);
                else value = input.value;

                if (value === undefined || value === null) return;
                settingsToSave[path] = value;
            });

        eventBus.emit(EVENTS.UI.SETTINGS.SAVE, settingsToSave);
        toggleElementVisibility(elements.settingsModal, false);
    }

    function getValueFromPath(obj, path) {
        return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    }

    function getMedal(index) {
        const medals = ["🥇", "🥈", "🥉"];
        return medals[index] || null;
    }

    function formatDate(timestamp) {
        if (!timestamp) return "";

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }

    function attachEventListeners() {
        if (elements.settingsButton)
            elements.settingsButton.addEventListener(
                "click",
                showSettingsModal
            );
        if (elements.restartButton)
            elements.restartButton.addEventListener("click", handleRestartButton);
        if (elements.saveSettingsButton)
            elements.saveSettingsButton.addEventListener(
                "click",
                handleSettingsSave
            );
        if (elements.resetSettingsButton)
            elements.resetSettingsButton.addEventListener(
                "click",
                handleSettingsReset
            );
    }

    function handleRestartButton() {
        eventBus.emit(EVENTS.UI.RESTART_REQUESTED);
    }

    function resetAll() {
        setLevel(0);
        setScore(0);
        toggleElementVisibility(elements.pauseElements, false);
        toggleElementVisibility(elements.gameOverElements, false);
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

    function togglePauseModal(isPaused) {
        toggleElementVisibility(elements.stateModal, isPaused);
        toggleElementVisibility(elements.pauseElements, isPaused, "block");
    }

    function showGameOverModal(snapshot) {
        toggleElementVisibility(elements.stateModal, true);
        toggleElementVisibility(elements.gameOverElements, true, "block");
        elements.finalLevel.textContent = snapshot.level;
        elements.finalScore.textContent = snapshot.score;
    }

    attachEventListeners();

    return {
        setLevel,
        setScore,
        setUsername,
        resetAll,
        togglePauseModal,
        showGameOverModal,
        showUsernameModal,
        showSettingsModal,
        renderLeaderboard,
        showLeaderboardError,
    };
}
