// /** @typedef {import('../types/score').ScoreEntry} ScoreEntry */

// /**
//  * Creates a Leaderboard UI Manager
//  * @returns {Object}
//  */
// export function createLeaderboardUI() {
//     const leaderboardElement = document.querySelector('.leaderboard ul');
    
//     if (!leaderboardElement) {
//         console.warn('Leaderboard element not found in DOM');
//     }

//     /**
//      * Renders the leaderboard with the given scores
//      * @param {ScoreEntry[]} scores 
//      */
//     function render(scores) {
//         if (!leaderboardElement) return;

//         if (!scores || scores.length === 0) {
//             leaderboardElement.innerHTML = '<li class="empty">No scores yet. Be the first!</li>';
//             return;
//         }

//         leaderboardElement.innerHTML = scores
//             .map((entry, index) => {
//                 const medal = getMedal(index);
//                 const date = formatDate(entry.timestamp);
                
//                 return `
//                     <li class="leaderboard-entry" data-rank="${index + 1}">
//                         <span class="rank">${medal || `#${index + 1}`}</span>
//                         <div class="player-info">
//                             <strong class="username">${escapeHtml(entry.username)}</strong>
//                             <span class="level">Level ${entry.level}</span>
//                         </div>
//                         <div class="score-info">
//                             <span class="score">${entry.score}</span>
//                             <span class="date">${date}</span>
//                         </div>
//                     </li>
//                 `;
//             })
//             .join('');
//     }

//     /**
//      * Shows a loading state
//      */
//     function showLoading() {
//         if (!leaderboardElement) return;
//         leaderboardElement.innerHTML = '<li class="loading">Loading scores...</li>';
//     }

//     /**
//      * Shows an error message
//      * @param {string} message 
//      */
//     function showError(message = 'Failed to load scores') {
//         if (!leaderboardElement) return;
//         leaderboardElement.innerHTML = `<li class="error">${escapeHtml(message)}</li>`;
//     }

//     /**
//      * Highlights a specific user's entry
//      * @param {string} username 
//      */
//     function highlightUser(username) {
//         if (!leaderboardElement) return;
        
//         const entries = leaderboardElement.querySelectorAll('.leaderboard-entry');
//         entries.forEach(entry => {
//             const usernameElement = entry.querySelector('.username');
//             if (usernameElement && usernameElement.textContent === username) {
//                 entry.classList.add('current-user');
//             }
//         });
//     }

//     /**
//      * Gets medal emoji for top 3 positions
//      * @param {number} index 
//      * @returns {string|null}
//      */
//     function getMedal(index) {
//         const medals = ['🥇', '🥈', '🥉'];
//         return medals[index] || null;
//     }

//     /**
//      * Formats timestamp to readable date
//      * @param {string} timestamp 
//      * @returns {string}
//      */
//     function formatDate(timestamp) {
//         if (!timestamp) return '';
        
//         const date = new Date(timestamp);
//         const now = new Date();
//         const diffMs = now - date;
//         const diffMins = Math.floor(diffMs / 60000);
//         const diffHours = Math.floor(diffMs / 3600000);
//         const diffDays = Math.floor(diffMs / 86400000);

//         if (diffMins < 1) return 'just now';
//         if (diffMins < 60) return `${diffMins}m ago`;
//         if (diffHours < 24) return `${diffHours}h ago`;
//         if (diffDays < 7) return `${diffDays}d ago`;
        
//         return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     }

//     /**
//      * Escapes HTML to prevent XSS
//      * @param {string} text 
//      * @returns {string}
//      */
//     function escapeHtml(text) {
//         const div = document.createElement('div');
//         div.textContent = text;
//         return div.innerHTML;
//     }

//     return {
//         render,
//         showLoading,
//         showError,
//         highlightUser
//     };
// }