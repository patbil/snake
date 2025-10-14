function initApp() {
    import("./core/game.js").then(({ createGame }) => {
        const canvas = document.getElementById("canvas");
        createGame(canvas).initialize();
    });
}

window.onload = initApp;
