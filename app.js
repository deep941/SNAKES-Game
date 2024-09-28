// app.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const snake =
  [
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

document.addEventListener('keydown', changeDirection);
main();
generateFood();

function main()
  {
    if (didGameEnd()) return;

    setTimeout(() =>
      {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        main();
    }, 100);
}

function clearCanvas() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake()
  {
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x, part.y, 20, 20);
        ctx.strokeRect(part.x, part.y, 20, 20);
    });
}

function moveSnake()
  {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === foodX && head.y === foodY)
    {
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;
        generateFood();
    } else
    {
        snake.pop();
    }
}

function changeDirection(event)
  {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight)
    {
        dx = -20;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) 
    {
        dx = 0;
        dy = -20;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft)
    {
        dx = 20;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp)
    {
        dx = 0;
        dy = 20;
    }
}

function generateFood()
  {
    foodX = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    foodY = Math.floor(Math.random() * (canvas.height / 20)) * 20;

    if (snake.some(part => part.x === foodX && part.y === foodY))
    {
        generateFood();
    }
}

function drawFood()
  {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

function didGameEnd()
  {
    for (let i = 4; i < snake.length; i++) 
    {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}
