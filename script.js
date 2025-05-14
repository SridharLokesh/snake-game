const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverMsg = document.getElementById("gameOverMsg");

const box = 20;
const canvasSize = 400;
let snake = [];
let direction = null;
let food = {};
let score = 0;
let running = false;
let gameOver = false;

function initGame() {
  snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
  ];
  direction = null;
  score = 0;
  food = createFood();
  scoreDisplay.textContent = score;
  gameOver = false;
  running = false;
  gameOverMsg.style.display = "none";
  draw();
}

function createFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
}

function gameLoop() {
  if (!running || gameOver) return;

  const head = {
    x: snake[0].x + (direction?.x || 0) * box,
    y: snake[0].y + (direction?.y || 0) * box
  };

  // Collision check
  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver = true;
    gameOverMsg.style.display = "block";
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = score;
    food = createFood(); // don't remove tail = grow
  } else {
    snake.pop(); // no food = move normally
  }

  draw();
  setTimeout(gameLoop, 150);
}

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Draw food
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  // Draw snake
  snake.forEach((seg, i) => {
    if (i === 0) {
      // Head
      ctx.beginPath();
      ctx.arc(seg.x + box / 2, seg.y + box / 2, box / 2, 0, Math.PI * 2);
      ctx.fillStyle = "green";
      ctx.fill();

      // Eyes
      ctx.beginPath();
      ctx.arc(seg.x + box / 2 - 4, seg.y + box / 2 - 4, 2, 0, Math.PI * 2);
      ctx.arc(seg.x + box / 2 + 4, seg.y + box / 2 - 4, 2, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    } else if (i === snake.length - 1) {
      // Tail
      ctx.beginPath();
      ctx.moveTo(seg.x + box / 2, seg.y + box / 2);
      ctx.lineTo(seg.x + box / 2 - 6, seg.y + box / 2 + 6);
      ctx.lineTo(seg.x + box / 2 + 6, seg.y + box / 2 + 6);
      ctx.fillStyle = "#006400";
      ctx.fill();
    } else {
      // Body
      ctx.beginPath();
      ctx.arc(seg.x + box / 2, seg.y + box / 2, box / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#228B22";
      ctx.fill();
    }
  });
}

document.addEventListener("keydown", e => {
  if (!running && !gameOver && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    running = true;
    if (e.key === "ArrowUp") direction = { x: 0, y: -1 };
    if (e.key === "ArrowDown") direction = { x: 0, y: 1 };
    if (e.key === "ArrowLeft") direction = { x: -1, y: 0 };
    if (e.key === "ArrowRight") direction = { x: 1, y: 0 };
    gameLoop();
    return;
  }

  if (gameOver && e.key === "Enter") {
    initGame();
    return;
  }

  if (direction) {
    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
    else if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
    else if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
    else if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
  }
});

initGame();
