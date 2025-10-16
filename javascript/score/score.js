import { EVENTS } from "../events/events.js";
import { withErrorHandling } from "../error/error-handling.js";

/** @typedef { import("../@types/score.js").ScoreManager } ScoreManager */
/** @typedef { import("../@types/score.js").ScoreEntry } ScoreEntry */
/** @typedef { import("../@types/event.js").EventBus } EventBus */
/** @typedef { import("../@types/firebase.js").FirebaseManager } FirebaseManager */

const LEADERBOARD_LIMIT = 15;
const SCORES_COLLECTION = "scores";

/**
 * Creates a manager responsible for maintaining and persisting the leaderboard.
 * Handles fetching scores from Firebase and adding new scores.
 *
 * @param {EventBus} eventBus - Event bus for emitting leaderboard updates
 * @param {FirebaseManager} firebase - Firebase manager instance
 * @returns {ScoreManager} Object with methods to manage scores
 */
export function createScoreManager(eventBus, firebase) {
    const scores = [];

    function sortScores() {
        return scores.sort((a, b) =>
            b.score === a.score ? b.level - a.level : b.score - a.score
        );
    }

    function updateLeaderboard(result) {
        scores.push(...result);
        sortScores();

        if (scores.length > LEADERBOARD_LIMIT) scores.pop();
        eventBus.emit(EVENTS.LEADERBOARD.UPDATE, scores);
    }

    function createErrorHandler(message) {
        return (error) =>
            eventBus.emit(EVENTS.LEADERBOARD.ERROR, { error, message });
    }

    async function fetchScores() {
        const results = await firebase.getAll(SCORES_COLLECTION, {
            limit: LEADERBOARD_LIMIT,
            orderBy: "score",
            orderDir: "desc",
        });

        if (results) {
            scores.splice(0);
            updateLeaderboard(results);
        }
    }

    async function addScore(entry) {
        const newEntry = {
            ...entry,
            timestamp: Date.now(),
            username: localStorage.getItem("username"),
        };

        await firebase.set(SCORES_COLLECTION, newEntry);
        updateLeaderboard([newEntry]);
    }

    return {
        getScores: () => scores,
        fetchScores: withErrorHandling(fetchScores, {
            onError: createErrorHandler("Could not load leaderboard"),
        }),
        addScore: withErrorHandling(addScore, {
            onError: createErrorHandler("Could not save your score"),
        }),
    };
}
