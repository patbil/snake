export function createLayoutManager() {
  const scoreElement = document.getElementById("score");
  const levelElement = document.getElementById("level");
  const settingButton = document.getElementById("settings");
  const settingsModal = document.getElementById("settingsModal");

  function updateScore(score) {
    scoreElement.textContent = score;
  }

  function updateLevel(level) {
    levelElement.textContent = level;
  }

  function togglePause(pause) {
    console.log(pause);
  }

  function gameOver(snapshot) {
    updateLevel(snapshot.level);
    updateScore(snapshot.score);
  }

  return { updateLevel, updateScore, togglePause, gameOver };
}
