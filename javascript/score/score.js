import { EVENTS } from "../events/events.js";
import { withErrorHandling } from "../error/error-handling.js";

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
        const newEntry = {
            ...entry,
            timestamp: new Date(),
            username: localStorage.getItem("username"),
        };
        await firebase.set("scores", newEntry);
        updateLeaderboard([newEntry]);
    }

    async function fetchScores() {
        const results = await firebase.getAll("scores");
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
