/**
 * A single entry in the leaderboard.
 * Represents one completed game session with player information and results.
 *
 * @typedef {Object} ScoreEntry
 * @property {string} username - Player's username.
 * @property {number} score - Player's final score.
 * @property {number} level - Final level reached by the player.
 * @property {number} timestamp - Timestamp when the score was recorded.
 */

/**
 * Public API of the Score Manager.
 * The Score Manager handles leaderboard functionality including saving scores and retrieving rankings.
 *
 * @typedef {Object} ScoreManager
 * @property {() => Promise<ScoreEntry[]>} fetchScores - Fetches scores from remote storage 
 * @property {(Omit<ScoreEntry, 'timestamp'>) => Promise<ScoreResult>} addScore - Adds a new score to the leaderboard.
 * @property {(limit?: number) => Promise<ScoreEntry[]>} fetchScores - Fetches top scores from remote storage.
 * @property {() => Promise<void>} getScores - Return list of all scores.
 */

export {};
