function initApp() {
    import("./game/game.js").then(({ createGame }) => {
        const canvas = document.getElementById("canvas");
        createGame(canvas).initialize();
    });
}

window.onload = initApp;
