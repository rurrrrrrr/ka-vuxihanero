let mode = 0;
let gravity;
let baseline;
let player;
let balls = [];
let specialBalls = [];
let lastBallTime;
let lastSpecialBallTime;
let specialBallInterval;
let startTime;
let scoreTime;
let jumpUnlimitedUntil;
let cheatInput = "";
let invincible = false;
const cheatCode = "nitijixyousai";
function setup() {
    createCanvas(1000, 400);
    angleMode(DEGREES);
    gravity = 10;
    baseline = height - 10;
    initGame();
}
function draw() {
    background(255);
    stroke("black");
    line(0, baseline, width, baseline);
    if (mode == 0) {
        showStartScreen();
    } else if (mode == 1) {
        playGame();
    } else if (mode == 2) {
        showGameOver();
    }
}
function keyPressed() {
    if (mode == 0) {
        if (key == " ") {
            initGame();
            cheatInput = "";
            mode = 1;
        } else if (key.length == 1 && /[a-z]/i.test(key)) {
            cheatInput = (cheatInput + key.toLowerCase()).slice(-cheatCode.length);
            if (cheatInput == cheatCode) {
                initGame();
                invincible = true;
                mode = 1;
                cheatInput = "";
            }
        }
    } else if (mode == 1 && key == " ") {
        playerJump();
    } else if (mode == 2 && key == " ") {
        cheatInput = "";
        mode = 0;
    }
}
function showStartScreen() {
    textAlign(CENTER);
    textSize(16);
    fill("black");
    text("Press SPACE Key", width / 2, height / 2);
    drawPlayer();
    drawBalls();
    drawScore();
}
function playGame() {
    updatePlayer();
    addBalls();
    updateBalls();
    addSpecialBalls();
    updateSpecialBalls();
    checkHits();
    checkSpecialBallHits();
    updateScore();
    drawPlayer();
    drawBalls();
    drawSpecialBalls();
    drawScore();
}
function showGameOver() {
    textAlign(CENTER);
    textSize(20);
    fill("black");
    text("GAME OVER", width / 2, height / 2);
    drawPlayer();
    drawBalls();
    drawSpecialBalls();
    drawScore();
}
function initGame() {
    player = {
        x: 150,
        y: height / 2,
        radius: 30,
        angle: 0,
        speedY: 0,
        jumpCount: 0,
    };
    balls = [];
    specialBalls = [];
    lastBallTime = millis();
    lastSpecialBallTime = millis();
    specialBallInterval = 10000;
    startTime = millis();
    scoreTime = 0;
    jumpUnlimitedUntil = 0;
    invincible = false;
}
function drawPlayer() {
    kirby(player.x, player.y, player.radius, player.angle);
}
function updatePlayer() {
    player.angle = player.angle + 10;
    player.speedY = player.speedY + gravity;
    player.y = player.y + player.speedY;
    if (player.y >= baseline - player.radius) {
        player.y = baseline - player.radius;
        player.speedY = 0;
        player.jumpCount = 2;
    }
}
function playerJump() {
    if (millis() < jumpUnlimitedUntil || player.jumpCount > 0) {
        player.speedY = -50;
        if (millis() >= jumpUnlimitedUntil) {
            player.jumpCount = player.jumpCount - 1;
        }
    }
}
function drawBalls() {
    for (let i = 0; i < balls.length; i++) {
        monsterBall(balls[i].x, balls[i].y, balls[i].radius, balls[i].angle);
    }
}
function addBalls() {
    let elapsedTime = millis() - startTime;
    let fastBallPeriod = elapsedTime >= 11000 && (elapsedTime - 11000) % 30000 < 9000;
    let ballInterval = fastBallPeriod ? 500 : 800;
    if (millis() - lastBallTime > ballInterval) {
        lastBallTime = millis();
        balls.push({
            x: width + 50,
            y: baseline - 150,
            radius: 30,
            speedX: 20,
            speedY: 5,
            angle: 0,
        });
    }
}
function updateBalls() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].x = balls[i].x - balls[i].speedX;
        balls[i].angle = balls[i].angle - 100;
        balls[i].speedY = balls[i].speedY + gravity;
        balls[i].y = balls[i].y + balls[i].speedY;
        if (balls[i].y >= baseline - balls[i].radius) {
            balls[i].y = baseline - balls[i].radius;
            balls[i].speedY = -balls[i].speedY;
        }
    }
}
function addSpecialBalls() {
    if (millis() - lastSpecialBallTime > specialBallInterval) {
        lastSpecialBallTime = millis();
        specialBallInterval = 30000;
        specialBalls.push({
            x: player.x,
            y: -50,
            radius: 24,
            speedY: 5,
            angle: 0,
        });
    }
}
function updateSpecialBalls() {
    for (let i = specialBalls.length - 1; i >= 0; i--) {
        specialBalls[i].angle = specialBalls[i].angle + 8;
        specialBalls[i].speedY = specialBalls[i].speedY + gravity;
        specialBalls[i].y = specialBalls[i].y + specialBalls[i].speedY;
        if (specialBalls[i].y > height + specialBalls[i].radius) {
            specialBalls.splice(i, 1);
        }
    }
}
function drawSpecialBalls() {
    for (let i = 0; i < specialBalls.length; i++) {
        specialBall(specialBalls[i].x, specialBalls[i].y, specialBalls[i].radius, specialBalls[i].angle);
    }
}
function checkHits() {
    if (invincible) {
        return;
    }
    for (let i = 0; i < balls.length; i++) {
        if (
            dist(player.x, player.y, balls[i].x, balls[i].y) <
            player.radius + balls[i].radius
        ) {
            mode = 2;
        }
    }
}
function checkSpecialBallHits() {
    for (let i = specialBalls.length - 1; i >= 0; i--) {
        if (
            dist(player.x, player.y, specialBalls[i].x, specialBalls[i].y) <
            player.radius + specialBalls[i].radius
        ) {
            jumpUnlimitedUntil = millis() + 10000;
            specialBalls.splice(i, 1);
        }
    }
}
function updateScore() {
    scoreTime = floor((millis() - startTime) / 10);
}
function drawScore() {
    fill("black");
    textAlign(LEFT);
    textSize(14);
    text("SCORE: " + scoreTime, width - 120, 25);
    if (millis() < jumpUnlimitedUntil) {
        textAlign(CENTER);
        fill("#1565C0");
        text("JUMP UNLIMITED: " + ceil((jumpUnlimitedUntil - millis()) / 1000), width / 2, 25);
    }
    if (invincible) {
        textAlign(CENTER);
        fill("#D32F2F");
        text("無敵モード中！", width / 2, 45);
    }
}
function kirby(x, y, radius, angle) {
    push();
    translate(x, y);
    rotate(angle);

    stroke("black");
    fill("#F8BBD0");
    circle(0, 0, radius * 2);

    fill("black");
    ellipse(-8, -5, 8, 15);
    ellipse(8, -5, 8, 15);

    fill("white");
    ellipse(-8, -7, 6, 8);
    ellipse(8, -7, 6, 8);
    noStroke();
    fill("#EC407A");
    ellipse(-18, 2, 12, 6);
    ellipse(18, 2, 12, 6);
    pop();
}
function monsterBall(x, y, radius, angle) {
    push();
    translate(x, y);
    rotate(angle);
    fill("red");
    circle(0, 0, radius * 2);
    fill("white");
    arc(0, 0, radius * 2, radius * 2, 0, 180);
    strokeWeight(floor(radius / 10));
    fill("black");
    line(-radius + 3, 0, radius - 3, 0);
    fill("white");
    circle(0, 0, radius / 2);
    pop();
}
function specialBall(x, y, radius, angle) {
    push();
    translate(x, y);
    rotate(angle);
    stroke("#1565C0");
    strokeWeight(3);
    fill("#81D4FA");
    circle(0, 0, radius * 2);
    fill("white");
    circle(0, 0, radius);
    strokeWeight(2);
    line(-radius / 2, 0, radius / 2, 0);
    line(0, -radius / 2, 0, radius / 2);
    pop();
}
