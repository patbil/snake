function initApp() {
    import("./core/game.js").then(async ({ createGame }) => {
        const canvas = document.getElementById("canvas");
        (await createGame(canvas)).initialize();
    });
}

window.onload = initApp;
