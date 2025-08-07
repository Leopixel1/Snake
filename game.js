// Cross-platform Snake Game

// Game constants
const BASE_SPEED = 200; // Initial game speed in ms
const MIN_GAME_SPEED = 80; // Maximum game speed
const SPEED_INCREASE_RATE = 1; // How much speed increases per score point
const GRID_SIZE = 20;

class UI {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        this.restartBtn = document.getElementById('restartBtn');
        this.touchControls = document.getElementById('touchControls');
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.detectPlatform();
    }
    
    setupCanvas() {
        const container = this.canvas.parentElement;
        const maxWidth = Math.min(400, window.innerWidth - 40);
        const maxHeight = Math.min(400, window.innerHeight - 200);
        
        const size = Math.min(maxWidth, maxHeight);
        
        const devicePixelRatio = window.devicePixelRatio || 1;
        this.canvas.width = size * devicePixelRatio;
        this.canvas.height = size * devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.canvas.style.width = `${size}px`;
        this.canvas.style.height = `${size}px`;
        
        this.gridPixelSize = size / GRID_SIZE;
    }
    
    detectPlatform() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         ('ontouchstart' in window) ||
                         (navigator.maxTouchPoints > 0);
        
        if (isMobile) {
            this.touchControls.style.display = 'flex';
        }
    }
    
    updateScore(score) {
        this.scoreElement.textContent = score;
    }

    updateHighScore(highScore) {
        this.highScoreElement.textContent = highScore;
    }

    showGameOver(score) {
        this.finalScoreElement.textContent = score;
        this.gameOverElement.classList.remove('hidden');
    }

    hideGameOver() {
        this.gameOverElement.classList.add('hidden');
    }

    draw(snake, food) {
        this.clearCanvas();
        snake.draw(this.ctx, this.gridPixelSize);
        food.draw(this.ctx, this.gridPixelSize);
    }

    clearCanvas() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Snake {
    constructor() {
        this.body = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.nextDirection = {dx: 0, dy: 0};
    }

    setDirection(dx, dy) {
        if (this.dx === -dx && this.dy === -dy && this.body.length > 1) return;
        this.nextDirection = {dx, dy};
    }

    move() {
        if (this.nextDirection.dx !== 0 || this.nextDirection.dy !== 0) {
            this.dx = this.nextDirection.dx;
            this.dy = this.nextDirection.dy;
        }

        const head = {x: this.body[0].x + this.dx, y: this.body[0].y + this.dy};
        this.body.unshift(head);
    }

    grow() {
        // The snake grows by not removing the tail segment
    }

    shrink() {
        this.body.pop();
    }

    checkCollision(gridSize) {
        const head = this.body[0];
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            return true; // Wall collision
        }
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true; // Self collision
            }
        }
        return false;
    }

    onFood(food) {
        return this.body[0].x === food.x && this.body[0].y === food.y;
    }

    reset() {
        this.body = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.nextDirection = {dx: 0, dy: 0};
    }

    draw(ctx, gridPixelSize) {
        this.body.forEach((segment, index) => {
            ctx.fillStyle = (index === 0) ? '#66BB6A' : '#4CAF50';
            this.drawRoundedRect(ctx, segment.x * gridPixelSize + 1, segment.y * gridPixelSize + 1, gridPixelSize - 2, gridPixelSize - 2, 3);
        });
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
}

class Food {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.x = 0;
        this.y = 0;
    }

    generate(snakeBody = []) {
        do {
            this.x = Math.floor(Math.random() * this.gridSize);
            this.y = Math.floor(Math.random() * this.gridSize);
        } while (snakeBody.some(segment => segment.x === this.x && segment.y === this.y));
    }

    draw(ctx, gridPixelSize) {
        const time = performance.now();
        const scale = 1 + Math.sin(time * 0.01) * 0.1;
        const offset = (gridPixelSize * (1 - scale)) / 2;

        ctx.fillStyle = '#FF7043';
        this.drawRoundedRect(ctx, this.x * gridPixelSize + offset, this.y * gridPixelSize + offset, gridPixelSize * scale, gridPixelSize * scale, 4);
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
}

class Game {
    constructor() {
        this.ui = new UI();
        this.snake = new Snake();
        this.food = new Food(GRID_SIZE);

        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.running = false;
        this.gameLoopId = null;

        this.ui.updateHighScore(this.highScore);
        this.food.generate(this.snake.body);
        this.setupEventListeners();
        this.draw();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        this.ui.touchControls.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const direction = e.target.closest('.control-btn')?.dataset.direction;
            if (direction) {
                this.handleTouchControl(direction);
            }
        });
        
        this.ui.restartBtn.addEventListener('click', () => this.restart());
        window.addEventListener('resize', () => {
            this.ui.setupCanvas();
            this.draw();
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.running) this.pause();
        });
    }
    
    handleKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if(this.running) {
                this.pause();
            } else if (this.snake.dx !== 0 || this.snake.dy !== 0) {
                this.start();
            }
            return;
        }
        
        let dx = 0, dy = 0;
        switch(e.key) {
            case 'ArrowUp': case 'w': case 'W': e.preventDefault(); dy = -1; break;
            case 'ArrowDown': case 's': case 'S': e.preventDefault(); dy = 1; break;
            case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); dx = -1; break;
            case 'ArrowRight': case 'd': case 'D': e.preventDefault(); dx = 1; break;
        }

        if (dx !== 0 || dy !== 0) {
            this.snake.setDirection(dx, dy);
            if (!this.running) this.start();
        }
    }
    
    handleTouchControl(direction) {
        let dx = 0, dy = 0;
        switch(direction) {
            case 'up': dy = -1; break;
            case 'down': dy = 1; break;
            case 'left': dx = -1; break;
            case 'right': dx = 1; break; // Corrected typo
        }
        
        if (dx !== 0 || dy !== 0) {
            this.snake.setDirection(dx, dy);
            if (!this.running) this.start();
        }
    }
    
    start() {
        if (this.running || (this.snake.dx === 0 && this.snake.dy === 0)) return;
        this.running = true;
        this.ui.hideGameOver();
        this.gameLoop();
    }
    
    pause() {
        this.running = false;
        if (this.gameLoopId) clearTimeout(this.gameLoopId);
    }
    
    restart() {
        this.pause();
        this.snake.reset();
        this.food.generate(this.snake.body);
        this.score = 0;
        this.ui.updateScore(this.score);
        this.ui.hideGameOver();
        this.draw();
    }
    
    gameLoop() {
        if (!this.running) return;
        
        this.update();
        this.draw();
        
        const speed = Math.max(MIN_GAME_SPEED, BASE_SPEED - this.score * SPEED_INCREASE_RATE);
        this.gameLoopId = setTimeout(() => this.gameLoop(), speed);
    }
    
    update() {
        this.snake.move();
        
        if (this.snake.checkCollision(GRID_SIZE)) {
            this.gameOver();
            return;
        }
        
        if (this.snake.onFood(this.food)) {
            this.score += 10;
            this.ui.updateScore(this.score);
            this.snake.grow();
            this.food.generate(this.snake.body);
            if (navigator.vibrate) navigator.vibrate(50);

            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('snakeHighScore', this.highScore);
                this.ui.updateHighScore(this.highScore);
            }
        } else {
            this.snake.shrink();
        }
    }
    
    draw() {
        this.ui.draw(this.snake, this.food);
    }
    
    gameOver() {
        this.running = false;
        this.ui.showGameOver(this.score);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => console.log('SW registered:', reg))
                .catch(err => console.log('SW registration failed:', err));
        });
    }
});