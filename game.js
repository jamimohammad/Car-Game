const playerCar = document.getElementById("player-car");
const enemyCars = document.querySelectorAll(".enemy-car");
const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const speedText = document.getElementById("speed");
const gameOverText = document.getElementById("game-over");
const startBtn = document.getElementById("start-btn");
const fast = document.getElementById('fast')
const highScoreText = document.getElementById("high-score");

const line = [295, 372, 445, 518, 590];

let playerPosition = 440;
let playerTop = 500;
let enemyPositions = [];
let enemyLanes = [];
let score = 0;
let level = 1;
let speed = 3;
let gameRunning = false;
const roadTop = 0;
const roadBottom = 520;
const roadLeft = 285;
const roadRight = 590;
const moveSpeed = 12;
let highScore = Number(localStorage.getItem("highScore")) || 0;
highScoreText.innerHTML = "High Score : " + highScore;

document.addEventListener("keydown", function (event) {

    if (!gameRunning) return;

    if (event.key === "ArrowLeft") {
        playerPosition -= moveSpeed;

        if (playerPosition < roadLeft) {
            playerPosition = roadLeft;
        }

        playerCar.style.left = playerPosition + "px";
    }

    if (event.key === "ArrowRight") {

        playerPosition += moveSpeed;

        if (playerPosition > roadRight) {
            playerPosition = roadRight;
        }
        playerCar.style.left = playerPosition + "px";
    }

    if (event.key === "ArrowUp") {

        playerTop -= moveSpeed;

        if (playerTop < roadTop) {
            playerTop = roadTop;
        }

        playerCar.style.top = playerTop + "px";
    }


    if (event.key === "ArrowDown") {

        playerTop += moveSpeed;

        if (playerTop > roadBottom) {
            playerTop = roadBottom;
        }

        playerCar.style.top = playerTop + "px";
    }

});

function startGame() {
    playerPosition = 440;
    playerCar.style.left = playerPosition + "px";
    score = 0;
    level = 1;
    speed = 3;
    scoreText.innerHTML = "Score : 0";
    levelText.innerHTML = "Level : 1";
    speedText.innerHTML = "Speed : 3";
    gameRunning = true;
    gameOverText.style.display = "none";
    startBtn.style.display = "none";

    enemyPositions = [];
    enemyLanes = [];

    for (let i = 0; i < enemyCars.length; i++) {
        enemyPositions.push(-200 * (i + 1));
        enemyLanes.push(Math.floor(Math.random() * line.length));
        enemyCars[i].style.top = enemyPositions[i] + "px";
        enemyCars[i].style.left = line[enemyLanes[i]] + "px";
    }
    moveEnemies();
}

function moveEnemies() {

    if (!gameRunning) return;
    for (let i = 0; i < enemyCars.length; i++) {

        let currentSpeed = speed;

        if (enemyCars[i].querySelector("#fast")) {

            let laneIsEmpty = true;
            for (let j = 0; j < enemyCars.length; j++) {

                if (i !== j && enemyLanes[i] === enemyLanes[j]) {
                    laneIsEmpty = false;
                    break;
                }
            }
            if (laneIsEmpty) {
                currentSpeed = speed + 3.5;
            }
        }
        enemyPositions[i] += currentSpeed;
        enemyCars[i].style.top = enemyPositions[i] + "px";

        if (enemyPositions[i] > 650) {
            enemyPositions[i] = -150;
            enemyLanes[i] = Math.floor(Math.random() * line.length);
            enemyCars[i].style.left = line[enemyLanes[i]] + "px";
            score++;
            scoreText.innerHTML = "Score : " + score;

            if (score % 10 === 0) {
                speed++;
                level++;
                speedText.innerHTML = "Speed : " + speed;
                levelText.innerHTML = "Level : " + level;
            }
        }
    }
    checkCollision();
    requestAnimationFrame(moveEnemies);

}

function checkCollision() {

    let player = playerCar.getBoundingClientRect();

    const horizontalMargin = 15;
    const verticalMargin = 15;

    for (let i = 0; i < enemyCars.length; i++) {

        let enemy = enemyCars[i].getBoundingClientRect();

        if (
            player.left + horizontalMargin < enemy.right - horizontalMargin &&
            player.right - horizontalMargin > enemy.left + horizontalMargin &&
            player.top + verticalMargin < enemy.bottom - verticalMargin &&
            player.bottom - verticalMargin > enemy.top + verticalMargin
        ) {

            gameRunning = false;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                highScoreText.innerHTML = "High Score : " + highScore;
            }

            gameOverText.style.display = "block";
            startBtn.style.display = "block";

            return;
        }
    }
}
startBtn.addEventListener("click", startGame);

