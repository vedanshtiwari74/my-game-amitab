let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// --- LOAD IMAGES ---
let amitabhImg = new Image();
amitabhImg.src = "amitabh.png";   // Amitabh image file in same folder

let flameImg = new Image();
flameImg.src = "flame.png";       // Fire flame image

// --- CHARACTER SETTINGS ---
let amitabh = {
    x: 50,
    y: 300,
    width: 60,
    height: 60,
    gravity: 0.35,   // very slow gravity
    lift: -12,       // smooth jump
    velocity: 0
};

// --- FIRE OBSTACLES ---
let fires = [];
let score = 0;
let gameOver = false;

let fireSound = document.getElementById("fireSound");

// ---- JUMP ----
function jump() {
    if (!gameOver) {
        amitabh.velocity = amitabh.lift;
    }
}

// Controls
document.addEventListener("keydown", jump);
canvas.addEventListener("mousedown", jump);
canvas.addEventListener("touchstart", e => { e.preventDefault(); jump(); });

// --- CREATE FIRE ---
setInterval(() => {
    if (!gameOver) {
        fires.push({
            x: 400,
            y: Math.random() * 450 + 50,
            width: 40,
            height: 120
        });
    }
}, 1800);

// ---- UPDATE GAME ----
function update() {
    if (gameOver) return;

    amitabh.velocity += amitabh.gravity;
    amitabh.y += amitabh.velocity;

    // Stay inside screen
    if (amitabh.y + amitabh.height > canvas.height) {
        endGame();
    }
    if (amitabh.y < 0) {
        amitabh.y = 0;
        amitabh.velocity = 0;
    }

    // Move fire
    fires.forEach(fire => {
        fire.x -= 3;

        // Collision
        if (
            amitabh.x < fire.x + fire.width &&
            amitabh.x + amitabh.width > fire.x &&
            amitabh.y < fire.y + fire.height &&
            amitabh.y + amitabh.height > fire.y
        ) {
            fireSound.play();
            endGame();
        }

        // Score
        if (fire.x + fire.width < amitabh.x && !fire.passed) {
            score++;
            fire.passed = true;
        }
    });

    fires = fires.filter(f => f.x + f.width > 0);
}

// ---- DRAW EVERYTHING ----
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Amitabh
    ctx.drawImage(amitabhImg, amitabh.x, amitabh.y, amitabh.width, amitabh.height);

    // Draw Fire Flames
    fires.forEach(fire => {
        ctx.drawImage(flameImg, fire.x, fire.y, fire.width, fire.height);
    });

    // Score
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// ---- GAME LOOP ----
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

// ---- GAME OVER ----
function endGame() {
    gameOver = true;
    document.getElementById("gameOverScreen").style.display = "block";
    document.getElementById("finalScore").innerText = "Your Score: " + score;
}

// ---- RESTART ----
function restartGame() {
    gameOver = false;
    score = 0;
    fires = [];
    amitabh.y = 300;
    amitabh.velocity = 0;

    document.getElementById("gameOverScreen").style.display = "none";
}
