export function createLayoutManager() {
    const scoreElement = document.getElementById("score");
    const levelElement = document.getElementById("level");
    const usernameElement = document.getElementById("username");
    
    const settingButton = document.getElementById("settings");
    const settingsModal = document.getElementById("settingsModal");
    const usernameModal = document.getElementById("usernameModal");

    async function showUsernameModal() {
        const modalHtml = await fetch("html/username-modal.html");
        usernameModal.innerHTML = modalHtml;
        usernameModal.classList.add("visible");

        const nameInput = document.getElementById('userNameInput');
        const startButton = document.getElementById('startGameButton');

        return new Promise((resolve, reject) => {
            const handleStart = () => {
                const userName = nameInput.value.trim();
                if (userName.length < 2) {
                    alert("Nazwa musi mieć co najmniej 2 znaki!");
                    return;
                }

                localStorage.setItem("username", userName);
                usernameElement.textContent += userName;
                usernameModal.classList.remove("visible");
                resolve(userName);
            };

            startButton.addEventListener("click", handleStart);
            nameInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    handleStart();
                }
            });
        });
    }

    function setupSettingsModal() {
        // Logika otwierania modala po kliknięciu przycisku
        settingButton.addEventListener("click", () => {
            // Zakładamy, że modal jest domyślnie ukryty i staje się widoczny po dodaniu klasy 'visible'
            settingsModal.classList.add("visible");
            // Opcjonalnie: Dodaj logikę pauzowania gry tutaj lub w funkcji obsługującej przycisk w głównym pliku
        });

        // Dodaj logikę zamykania modala (np. kliknięcie przycisku "Zamknij" lub tła)
        // const closeButton = settingsModal.querySelector('.close-button');
        // closeButton.addEventListener('click', () => {
        //     settingsModal.classList.remove('visible');
        // });
    }

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

    async function loadHtml(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(
                    `Loading error: ${filePath}: ${response.statusText}`
                );
            }
            return await response.text();
        } catch (err) {
            console.err("Failed to use resource:", err);
        }
    }

    return {
        updateLevel,
        updateScore,
        togglePause,
        gameOver,
        setupSettingsModal,
        showUsernameModal
    };
}
