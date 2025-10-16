import { withErrorHandling } from "../error/error-handling.js";
import { EVENTS } from "../events/events.js";

export function createScoreManager(eventBus, firebase) {
    const scores = new Array();

    function getScores() {
        return scores;
    }

    function clearScores() {
        scores.splice(0);
    }

    function sortScores() {
        return scores.sort((a, b) => b.score - a.score);
    }

    function updateLeaderboard(result) {
        scores.push(...result);
        sortScores();
        eventBus.emit(EVENTS.LEADERBOARD.UPDATE, scores);
    }

    const addScore = withErrorHandling(
        async (entry) => {
            await firebase.set("scores", {
                ...entry,
                timestamp: Date.now(),
                username: localStorage.getItem("username"),
            });
        },
        {
            onError: (error) =>
                eventBus.emit(EVENTS.LEADERBOARD.ERROR, {
                    error,
                    message: "Could not save your score",
                }),
        }
    );

    const fetchScores = withErrorHandling(
        async () => {
            const results = await firebase.getAll("scores");
            if (results) {
                clearScores();
                updateLeaderboard(results);
            }
        },
        {
            onError: (error) =>
                eventBus.emit(EVENTS.LEADERBOARD.ERROR, {
                    error,
                    message: "Could not load leaderboard",
                }),
        }
    );


    return { addScore, getScores, fetchScores };
}
