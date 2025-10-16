import { EVENTS } from "../events/events.js";

export async function createScoreManager(eventBus, firebase) {
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

    function updateLeaderboard(score) {
        scores.push(score);
        sortScores();
        eventBus.emit(EVENTS.LEADERBOARD.UPDATE, scores);
    }

    async function addScore(entry) {
        console.log(entry);
        try {
            await firebase.set("scores", {});
        } catch (error) {
            eventBus.emit(EVENTS.ERROR, {
                message: "Could not save your score",
                error: error.message,
            });
            throw error;
        }
    }

    async function fetchScores() {
        try {
            const results = await firebase.getAll("scores");
            if (results) {
                scores.push(...results);
                sortScores();
                eventBus.emit(EVENTS.LEADERBOARD.UPDATE, scores);
            }
        } catch (error) {
            eventBus.emit(EVENTS.ERROR, {
                message: "Could not load leaderboard",
                error: error.message,
            });
            throw error;
        }
    }

    await fetchScores();

    return { addScore, getScores };
}
