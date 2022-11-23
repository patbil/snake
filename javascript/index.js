const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let gameActive = false;

// Game params
let gridSize = (titleSize = 25);
let nextX = (nextY = 0);
let snakeX = (snakeY = 10);
let appleX = (appleY = 15);
let size = 5;
let trails = [];
let points = 0;

window.onload = function () {
    gameActive = true;
    showPoints();
    document.addEventListener('keydown', keydown);
    setInterval(draw, 1000 / 20);
}

const startGame = () => {
    gameActive = true;
}

const endGame = () => {
    gameActive = false;
}

const pauseGame = () => {
    gameActive = false;
}

const keydown = (e) => {
    console.log(e);
    switch (e.keyCode) {
        case 37:
            nextX = -1;
            nextY = 0;
            break;
        case 38:
            nextX = 0;
            nextY = -1;
            break;
        case 39:
            nextX = 1;
            nextY = 0;
            break;
        case 40:
            nextX = 0;
            nextY = 1;
            break;
        case 80:
            console.log("PAUSE");
            break;
        case 82:
            console.log("RESTART")
            break;
        default:
            console.log("ERROR::NOT_IMPLEMENTATION");
            break;
    }
}

const draw = () => {
    snakeX += nextX;
    snakeY += nextY;

    if (snakeX < 0) snakeX = titleSize - 1;
    if (snakeY < 0) snakeY = titleSize - 1;
    if (snakeX > titleSize - 1) snakeX = 0;
    if (snakeY > titleSize - 1) snakeY = 0;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    ctx.fillRect(appleX * gridSize, appleY * gridSize, gridSize - 4, gridSize - 4);

    ctx.fillStyle = 'red'
    for (let i = 0; i < trails.length; i++) {
        ctx.fillRect(trails[i].x * gridSize, trails[i].y * gridSize, gridSize - 4, gridSize - 4);

        if (trails[i].x == snakeX && trails[i].y == snakeY) size = 5
    }

    trails.push({ x: snakeX, y: snakeY });
    while (trails.length > size) trails.shift();


    if (snakeX == appleX && snakeY == appleY) {
        size++;
        showPoints();
        appleX = Math.floor(Math.random() * titleSize);
        appleY = Math.floor(Math.random() * titleSize);
    }

}

function showPoints () {
    points ++;
    document.getElementById('points').innerHTML = "<h3> Points: " + points + "</h3>";
}