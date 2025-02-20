const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

// Set canvas size based on container
const container = document.getElementById('game-container');
const updateCanvasSize = () => {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    canvas.width = containerWidth - 30; // Account for padding
    canvas.height = containerHeight - 30;
};
updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 },
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let isPaused = false;
let isGameStarted = false;
let gameSpeed = 200; // Initial slower speed (milliseconds)

document.addEventListener('keydown', handleKeyPress);

function handleMobileControl(direction) {
    if (!isGameStarted) return;
    
    switch(direction) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
}

// Touch controls
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
});

canvas.addEventListener('touchend', (e) => {
    if (!isGameStarted) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && dx === 0) { dx = 1; dy = 0; }
        else if (deltaX < 0 && dx === 0) { dx = -1; dy = 0; }
    } else {
        // Vertical swipe
        if (deltaY > 0 && dy === 0) { dx = 0; dy = 1; }
        else if (deltaY < 0 && dy === 0) { dx = 0; dy = -1; }
    }
});

function handleKeyPress(e) {
    if (!isGameStarted) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
        case 'p':
        case 'P':
            togglePause();
            break;
    }
}

function togglePause() {
    isPaused = !isPaused;
    const pauseMenuElement = document.getElementById('pause-menu');
    pauseMenuElement.style.display = isPaused ? 'block' : 'none';
    if (isPaused) {
        clearInterval(gameLoop);
    } else {
        startGameLoop();
    }
}

function resumeGame() {
    if (isPaused) {
        togglePause();
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = score;
    isGameStarted = false;
}

function restartGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 200; // Reset speed
    scoreElement.textContent = 'Score: 0';
    gameOverElement.style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    isGameStarted = true;
    startGameLoop();
}

function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    ctx.shadowBlur = 0;
}

function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.shadowBlur = 0;
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    scoreElement.classList.remove('score-pop');

    // Check wall collision
    const maxX = Math.floor(canvas.width / gridSize);
    const maxY = Math.floor(canvas.height / gridSize);
    if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
        gameOver();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        // Increase speed with each food eaten
        gameSpeed = Math.max(50, 200 - Math.floor(score / 20) * 10);
        clearInterval(gameLoop);
        startGameLoop();
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    const maxX = Math.floor(canvas.width / gridSize);
    const maxY = Math.floor(canvas.height / gridSize);
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!isGameStarted || (dx === 0 && dy === 0)) {
        drawSnake();
        drawFood();
        return;
    }
    
    moveSnake();
    drawSnake();
    drawFood();
}

function startGameLoop() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

function startGame() {
    isGameStarted = true;
    document.getElementById('instructions').style.display = 'none';
    startGameLoop();
}

update(); // Initial draw