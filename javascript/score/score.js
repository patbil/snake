import { EVENTS } from "../events/events.js";

export async function createScoreManager(eventBus, firebase) {
    const scores = [];

    async function addScore() {
        const result = await firebase.add("scores", {});
    }

    async function getScores() {
        const result = await firebase.get("scores");
        if (result) {
            scores.push(...result.data);
            eventBus.emit(EVENTS.LEADERBOARD.UPDATE, scores);
        }
    }

    await getScores();

    return { addScore, getScores };
}
