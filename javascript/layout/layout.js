const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const settingButton = document.getElementById('settings');
const settingsModal = document.getElementById('settingsModal');

function updateScore(score) {
    scoreElement.textContent = score;
}

function updateLevel(level) {
    levelElement.textContent = level;
}

settingButton.onclick = () => {


}

export { updateScore, updateLevel }; 