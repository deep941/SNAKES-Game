const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

let snake = [
    { x: 160, y: 160 },
    { x: 140, y: 160 },
    { x: 120, y: 160 },
    { x: 100, y: 160 }
];

let dx = 20;
let dy = 0;
let foodX;
let foodY;
let score = 0;
let speed = 100;  // Initial speed
let highScore = localStorage.getItem('highScore') || 0;
let wallPass = false;
let snakeColor = document.getElementById('snakeColor').value;

document.getElementById('highScore').textContent = `High Score: ${highScore}`;
document.addEventListener('keydown', changeDirection);
document.getElementById('wallPassToggle').addEventListener('change', toggleWallPass);
document.getElementById('snakeColor').addEventListener('input', updateSnakeColor);

main();
generateFood();

function main() {
    if (didGameEnd()) return;

    setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        main();
    }, speed);  // Adjust speed based on score
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(part.x, part.y, 20, 20);
        ctx.strokeRect(part.x, part.y, 20, 20);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall pass logic
    if (wallPass) {
        if (head.x >= canvas.width) head.x = 0;
        if (head.x < 0) head.x = canvas.width - 20;
        if (head.y >= canvas.height) head.y = 0;
        if (head.y < 0) head.y = canvas.height - 20;
    }

    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += 10;
        updateSpeed();
        document.getElementById('score').textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -20;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 20;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

function generateFood() {
    foodX = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    foodY = Math.floor(Math.random() * (canvas.height / 20)) * 20;

    if (snake.some(part => part.x === foodX && part.y === foodY)) {
        generateFood();
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            updateHighScore();
            return true;
        }
    }

    const hitLeftWall = snake[0].x < 0 && !wallPass;
    const hitRightWall = snake[0].x >= canvas.width && !wallPass;
    const hitTopWall = snake[0].y < 0 && !wallPass;
    const hitBottomWall = snake[0].y >= canvas.height && !wallPass;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        updateHighScore();
        return true;
    }

    return false;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').textContent = `High Score: ${highScore}`;
    }
}

function updateSpeed() {
    if (score % 50 === 0 && speed > 40) {
        speed -= 10;  // Increase speed as the score increases
    }
}

function toggleWallPass() {
    wallPass = document.getElementById('wallPassToggle').checked;
}

function updateSnakeColor() {
    snakeColor = document.getElementById('snakeColor').value;
}

function resetGame() {
    snake = [
        { x: 160, y: 160 },
        { x: 140, y: 160 },
        { x: 120, y: 160 },
        { x: 100, y: 160 }
    ];
    dx = 20;
    dy = 0;
    score = 0;
    speed = 100;
    wallPass = false;
    document.getElementById('score').textContent = `Score: 0`;
    document.getElementById('wallPassToggle').checked = false;
}
