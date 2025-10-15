/**
 * @typedef {Object} ScoreEntry
 * @property {string} username - Player's username
 * @property {number} score - Player's score
 * @property {number} level - Level reached
 * @property {string} timestamp - ISO timestamp of when the score was achieved
 */

/**
 * @typedef {Object} ScoreResult
 * @property {boolean} saved - Whether the score was successfully saved
 * @property {number} rank - Player's rank on the leaderboard (1-based)
 * @property {boolean} isTopScore - Whether this is the #1 score
 */

/**
 * @typedef {Object} ScoreManagerPublicAPI
 * @property {(username: string, score: number, level: number) => Promise<ScoreResult>} addScore - Adds a new score to the leaderboard
 * @property {(limit?: number) => Promise<ScoreEntry[]>} getLeaderboard - Gets the current leaderboard
 * @property {(username: string) => Promise<ScoreEntry|null>} getUserBestScore - Gets the user's best score
 * @property {(score: number) => Promise<boolean>} isQualifyingScore - Checks if a score qualifies for the leaderboard
 * @property {() => Promise<ScoreEntry[]>} fetchScores - Fetches scores from remote storage
 */

export {};