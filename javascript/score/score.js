import { EVENTS } from "../events/events.js";
import { withErrorHandling } from "../error/error-handling.js";

/** @typedef { import("../@types/score.js").ScoreManager } ScoreManager */
/** @typedef { import("../@types/score.js").ScoreEntry } ScoreEntry */

/**
 * Creates a manager responsible for maintaining the list of best results.
 * @async
 * @returns {Promise<ScoreManager>} 
 */
export function createScoreManager(eventBus, firebase) {
    const scores = [];

    function sortScores() {
        return scores.sort((a, b) => b.score - a.score);
    }

    function updateLeaderboard(result) {
        scores.push(...result);
        sortScores();
        eventBus.emit(EVENTS.LEADERBOARD.UPDATE, scores);
    }

    async function addScore(entry) {
        /** @type {ScoreEntry} */
        const newEntry = {
            ...entry,
            timestamp: Date.now(),
            username: localStorage.getItem("username"),
        };
        await firebase.set("scores", newEntry);
        updateLeaderboard([newEntry]);
    }

    async function fetchScores() {
        const results = await firebase.getAll("scores", { limit: 10, orderBy: 'score', });
        if (results) {
            scores.splice(0);
            updateLeaderboard(results);
        }
    }

    return {
        getScores: () => scores,
        fetchScores: withErrorHandling(fetchScores, {
            onError: (error) =>
                eventBus.emit(EVENTS.LEADERBOARD.ERROR, {
                    error,
                    message: "Could not load leaderboard",
                }),
        }),
        addScore: withErrorHandling(addScore, {
            onError: (error) =>
                eventBus.emit(EVENTS.LEADERBOARD.ERROR, {
                    error,
                    message: "Could not save your score",
                }),
        }),
    };
}
