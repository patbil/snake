/**
 * A single entry in the leaderboard.
 * Represents one completed game session with player information and results.
 * 
 * @typedef {Object} ScoreEntry
 * @property {string} username - Player's username/display name.
 * @property {number} score - Player's final score.
 * @property {number} level - Final level reached by the player.
 * @property {string} timestamp - ISO 8601 timestamp of when the score was achieved.
 */

/**
 * Result of adding a score to the leaderboard.
 * 
 * @typedef {Object} ScoreResult
 * @property {boolean} saved - Whether the score was successfully saved to storage.
 * @property {number} rank - Player's rank on the leaderboard (1-based index).
 * @property {boolean} isTopScore - Whether this is the #1 score on the leaderboard.
 */

/**
 * Public API of the Score Manager.
 * The Score Manager handles leaderboard functionality including saving scores,
 * retrieving rankings, and managing persistent storage of high scores.
 * 
 * @typedef {Object} ScoreManager
 * @property {(username: string, score: number, level: number) => Promise<ScoreResult>} addScore
 *           Adds a new score to the leaderboard.
 *           @param {string} username - Player's username
 *           @param {number} score - Final score achieved
 *           @param {number} level - Final level reached
 *           @returns {Promise<ScoreResult>} Result with rank and save status
 * 
 * @property {(limit?: number) => Promise<ScoreEntry[]>} getLeaderboard
 *           Gets the current leaderboard, sorted by score (highest first).
 *           @param {number} [limit] - Optional maximum number of entries to return
 *           @returns {Promise<ScoreEntry[]>} Array of score entries
 * 
 * @property {(username: string) => Promise<ScoreEntry|null>} getUserBestScore
 *           Gets the user's best (highest) score from the leaderboard.
 *           @param {string} username - Player's username to search for
 *           @returns {Promise<ScoreEntry|null>} Best score entry or null if not found
 * 
 * @property {(score: number) => Promise<boolean>} isQualifyingScore
 *           Checks if a score qualifies for the leaderboard.
 *           Useful for determining whether to show the "save score" prompt.
 *           @param {number} score - Score to check
 *           @returns {Promise<boolean>} True if score qualifies for leaderboard
 * 
 * @property {() => Promise<ScoreEntry[]>} fetchScores
 *           Fetches scores from remote storage (if configured).
 *           Synchronizes local leaderboard with remote data.
 *           @returns {Promise<ScoreEntry[]>} Array of score entries from remote storage
 */

export {};