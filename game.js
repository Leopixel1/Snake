// Cross-platform Snake Game

// Game speed constants
window.BASE_SPEED = 150; // Base game speed in milliseconds
window.MIN_GAME_SPEED = 80; // Minimum game speed (fastest)
window.SPEED_INCREASE_RATE = 2; // Speed increase per score point

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        this.restartBtn = document.getElementById('restartBtn');
        this.touchControls = document.getElementById('touchControls');
        
        // Game state
        this.gridSize = 20;
        this.tileCount = 20;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        this.gameLoopId = null;
        
        // Snake initial state
        this.snake = [
            {x: 10, y: 10}
        ];
        this.dx = 0;
        this.dy = 0;
        this.nextDirection = {dx: 0, dy: 0};
        
        // Food
        this.food = {x: 5, y: 5};
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.updateHighScore();
        this.generateFood();
        this.draw();
        this.detectPlatform();
    }
    
    setupCanvas() {
        // Make canvas responsive
        const container = this.canvas.parentElement;
        const maxWidth = Math.min(400, window.innerWidth - 40);
        const maxHeight = Math.min(400, window.innerHeight - 200);
        
        // Keep it square
        const size = Math.min(maxWidth, maxHeight);
        
        // Calculate grid size based on canvas size
        this.tileCount = 20;
        this.gridSize = size / this.tileCount;
        
        // Set up canvas dimensions and high DPI display support
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // Set CSS size
        this.canvas.style.width = size + 'px';
        this.canvas.style.height = size + 'px';
        
        // Set actual canvas size for high DPI
        this.canvas.width = size * devicePixelRatio;
        this.canvas.height = size * devicePixelRatio;
        
        // Scale context for high DPI
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    
    detectPlatform() {
        // Show touch controls on mobile/tablet devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         ('ontouchstart' in window) ||
                         (navigator.maxTouchPoints > 0);
        
        if (isMobile) {
            this.touchControls.style.display = 'flex';
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch controls
        const controlBtns = document.querySelectorAll('.control-btn');
        
        controlBtns.forEach(btn => {
            let touchStarted = false;
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchStarted = true;
                this.handleTouchControl(btn.dataset.direction);
            });
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Only handle click if touch didn't already handle it
                if (!touchStarted) {
                    this.handleTouchControl(btn.dataset.direction);
                }
                // Reset flag after a short delay
                setTimeout(() => touchStarted = false, 100);
            });
        });
        
        // Restart button
        this.restartBtn.addEventListener('click', () => this.restart());
        
        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.draw();
        });
        
        // Prevent context menu on long press
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle visibility change (mobile browser optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.gameRunning) {
                this.pause();
            }
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning && e.key !== ' ') return;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                this.changeDirection(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                this.changeDirection(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                this.changeDirection(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                this.changeDirection(1, 0);
                break;
            case ' ':
                e.preventDefault();
                if (this.gameRunning) {
                    this.pause();
                } else {
                    this.start();
                }
                break;
        }
    }
    
    handleTouchControl(direction) {
        // Start game if not running and set direction
        if (!this.gameRunning) {
            this.start();
        }
        
        switch(direction) {
            case 'up':
                this.changeDirection(0, -1);
                break;
            case 'down':
                this.changeDirection(0, 1);
                break;
            case 'left':
                this.changeDirection(-1, 0);
                break;
            case 'right':
                this.changeDirection(1, 0);
                break;
        }
    }
    
    changeDirection(newDx, newDy) {
        // Prevent immediate reverse direction
        if (this.dx === -newDx && this.dy === -newDy) return;
        
        this.nextDirection = {dx: newDx, dy: newDy};
        
        // Start game if not running
        if (!this.gameRunning) {
            this.start();
        }
    }
    
    start() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gameOverElement.classList.add('hidden');
        this.gameLoop();
    }
    
    pause() {
        this.gameRunning = false;
        if (this.gameLoopId) {
            clearTimeout(this.gameLoopId);
        }
    }
    
    restart() {
        this.pause();
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.nextDirection = {dx: 0, dy: 0};
        this.score = 0;
        this.updateScore();
        this.generateFood();
        this.draw();
        this.gameOverElement.classList.add('hidden');
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        // Adaptive game speed based on score
        const speed = Math.max(window.MIN_GAME_SPEED, window.BASE_SPEED - this.score * window.SPEED_INCREASE_RATE);
        this.gameLoopId = setTimeout(() => this.gameLoop(), speed);
    }
    
    update() {
        // Update direction
        if (this.nextDirection.dx !== 0 || this.nextDirection.dy !== 0) {
            this.dx = this.nextDirection.dx;
            this.dy = this.nextDirection.dy;
        }
        
        // Move snake head
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
            // Add vibration feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        } else {
            this.snake.pop();
        }
    }
    
    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach((segment, index) => {
            // Snake head is slightly different color
            if (index === 0) {
                this.ctx.fillStyle = '#66BB6A';
            } else {
                this.ctx.fillStyle = '#4CAF50';
            }
            
            this.drawRoundedRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2,
                3
            );
        });
        
        // Draw food
        this.ctx.fillStyle = '#FF5722';
        this.drawRoundedRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4,
            4
        );
        
        // Add food animation
        const time = performance.now();
        const scale = 1 + Math.sin(time * 0.01) * 0.1;
        const offset = (this.gridSize * (1 - scale)) / 2;
        this.ctx.fillStyle = '#FF7043';
        this.drawRoundedRect(
            this.food.x * this.gridSize + offset,
            this.food.y * this.gridSize + offset,
            this.gridSize * scale,
            this.gridSize * scale,
            4
        );
    }
    
    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateHighScore();
        }
    }
    
    updateHighScore() {
        this.highScoreElement.textContent = this.highScore;
    }
    
    gameOver() {
        this.gameRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.classList.remove('hidden');
        
        // Vibration feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    }
}

// Initialize game when DOM is loaded
function initGame() {
    console.log('Initializing game...');
    window.game = new SnakeGame();
    console.log('Game initialized:', window.game);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM is already loaded
    initGame();
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
});