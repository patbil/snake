const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

// Game params
let gameParams = {}, interval = undefined;
const GRIDSIZE = 25;

window.onload = function () {
    document.addEventListener('keydown', keydown);
    startGame();
}

// setting default values
function setDefault() {
    gameParams = {
        active: false,
        size: 5,
        level: 1,
        points: 0,
        trails: [],
        apple: {
            x: 15,
            y: 15
        },
        snake: {
            x: 10,
            y: 10
        },
        next: {
            x: 0,
            y: 0
        }
    }
}

const startGame = () => {
    setDefault();
    showPoints();
    runInterval();
}

const keydown = (e) => {
    switch (e.keyCode) {
        case 37:
            gameParams.next.x = -1;
            gameParams.next.y = 0;
            break;
        case 38:
            gameParams.next.x = 0;
            gameParams.next.y = -1;
            break;
        case 39:
            gameParams.next.x = 1;
            gameParams.next.y = 0;
            break;
        case 40:
            gameParams.next.x = 0;
            gameParams.next.y = 1;
            break;
        case 80:
            pauseGame();
            break;
        case 82: // restart - R
            startGame();
            break;
    }
}

function controller() {
    gameParams.snake.x += gameParams.next.x;
    gameParams.snake.y += gameParams.next.y;

    if (gameParams.snake.x < 0) gameParams.snake.x = GRIDSIZE - 1;
    if (gameParams.snake.y < 0) gameParams.snake.y = GRIDSIZE - 1;
    if (gameParams.snake.x > GRIDSIZE - 1) gameParams.snake.x = 0;
    if (gameParams.snake.y > GRIDSIZE - 1) gameParams.snake.y = 0;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    ctx.fillRect(gameParams.apple.x * GRIDSIZE, gameParams.apple.y * GRIDSIZE, GRIDSIZE - 4, GRIDSIZE - 4);

    ctx.fillStyle = 'red'

    for (let i = 0; i < gameParams.trails.length; i++) {
        ctx.fillRect(gameParams.trails[i].x * GRIDSIZE, gameParams.trails[i].y * GRIDSIZE, GRIDSIZE - 4, GRIDSIZE - 4);

        if ((gameParams.size !== 5) && (gameParams.trails[i].x === gameParams.snake.x && gameParams.trails[i].y === gameParams.snake.y))
            startGame();
    }
    gameParams.trails.push({ x: gameParams.snake.x, y: gameParams.snake.y });
    while (gameParams.trails.length > gameParams.size) gameParams.trails.shift();

    if (gameParams.snake.x == gameParams.apple.x && gameParams.snake.y == gameParams.apple.y) {
        gameParams.apple.x = Math.floor(Math.random() * GRIDSIZE);
        gameParams.apple.y = Math.floor(Math.random() * GRIDSIZE);
        increaseStatistics();
    }
}

function increaseStatistics() {
    gameParams.points++;
    gameParams.size++;
    showPoints();

    if (gameParams.points % 5 === 0) {
        gameParams.level++;
        runInterval();
    }
}

function runInterval() {
    if (interval) {
        clearInterval(interval);
        interval = undefined;
    }
    interval = setInterval(controller, 1000 / (gameParams.level + 10));
}

function showPoints() {
    document.getElementById('points').innerHTML = "<h3> Points: " + gameParams.points + "</h3>";
}

// const pauseGame = () => {
//     gameActive = false;
// }