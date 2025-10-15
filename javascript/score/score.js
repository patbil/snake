/** @typedef {import('../types/score').ScoreEntry} ScoreEntry */
/** @typedef {import('../types/score').ScoreManagerPublicAPI} ScoreManagerPublicAPI */

/**
 * Creates a Score Manager that handles leaderboard data using GitHub Gist.
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.gistId - GitHub Gist ID where scores are stored
 * @param {string} config.githubToken - GitHub Personal Access Token
 * @returns {ScoreManagerPublicAPI}
 */
export function createScoreManager(config = {}) {
    const GIST_ID = config.gistId || '';
    const GITHUB_TOKEN = config.githubToken || '';
    const GIST_FILENAME = 'snake-leaderboard.json';
    const MAX_LEADERBOARD_SIZE = 10;
    
    let cachedScores = [];
    let isLoading = false;

    /**
     * Fetches the current leaderboard from GitHub Gist
     * @returns {Promise<ScoreEntry[]>}
     */
    async function fetchScores() {
        if (!GIST_ID || !GITHUB_TOKEN) {
            console.warn('GitHub Gist not configured. Using local cache only.');
            return cachedScores;
        }

        if (isLoading) {
            return cachedScores;
        }

        isLoading = true;

        try {
            const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const gist = await response.json();
            const fileContent = gist.files[GIST_FILENAME]?.content;

            if (fileContent) {
                const data = JSON.parse(fileContent);
                cachedScores = Array.isArray(data.scores) ? data.scores : [];
            } else {
                cachedScores = [];
            }

            return cachedScores;
        } catch (error) {
            console.error('Failed to fetch scores:', error);
            return cachedScores;
        } finally {
            isLoading = false;
        }
    }

    /**
     * Saves the leaderboard to GitHub Gist
     * @param {ScoreEntry[]} scores 
     * @returns {Promise<boolean>}
     */
    async function saveScores(scores) {
        if (!GIST_ID || !GITHUB_TOKEN) {
            console.warn('GitHub Gist not configured. Scores not saved.');
            return false;
        }

        try {
            const content = JSON.stringify({
                scores: scores,
                lastUpdated: new Date().toISOString()
            }, null, 2);

            const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        [GIST_FILENAME]: {
                            content: content
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to save scores: ${response.status}`);
            }

            cachedScores = scores;
            return true;
        } catch (error) {
            console.error('Failed to save scores:', error);
            return false;
        }
    }

    /**
     * Adds a new score to the leaderboard
     * @param {string} username 
     * @param {number} score 
     * @param {number} level 
     * @returns {Promise<{saved: boolean, rank: number, isTopScore: boolean}>}
     */
    async function addScore(username, score, level) {
        await fetchScores();

        const newEntry = {
            username: username.trim(),
            score: score,
            level: level,
            timestamp: new Date().toISOString()
        };

        // Add new score and sort by score (descending)
        const updatedScores = [...cachedScores, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_LEADERBOARD_SIZE);

        const rank = updatedScores.findIndex(entry => 
            entry.username === newEntry.username && 
            entry.score === newEntry.score &&
            entry.timestamp === newEntry.timestamp
        ) + 1;

        const isTopScore = rank === 1;
        const saved = await saveScores(updatedScores);

        return {
            saved,
            rank,
            isTopScore
        };
    }

    /**
     * Gets the current leaderboard
     * @param {number} limit - Maximum number of entries to return
     * @returns {Promise<ScoreEntry[]>}
     */
    async function getLeaderboard(limit = MAX_LEADERBOARD_SIZE) {
        await fetchScores();
        return cachedScores.slice(0, limit);
    }

    /**
     * Gets the user's best score
     * @param {string} username 
     * @returns {Promise<ScoreEntry|null>}
     */
    async function getUserBestScore(username) {
        await fetchScores();
        const userScores = cachedScores.filter(
            entry => entry.username.toLowerCase() === username.toLowerCase()
        );
        return userScores.length > 0 ? userScores[0] : null;
    }

    /**
     * Checks if a score qualifies for the leaderboard
     * @param {number} score 
     * @returns {Promise<boolean>}
     */
    async function isQualifyingScore(score) {
        await fetchScores();
        if (cachedScores.length < MAX_LEADERBOARD_SIZE) {
            return true;
        }
        const lowestScore = cachedScores[cachedScores.length - 1]?.score || 0;
        return score > lowestScore;
    }

    return {
        addScore,
        getLeaderboard,
        getUserBestScore,
        isQualifyingScore,
        fetchScores
    };
}