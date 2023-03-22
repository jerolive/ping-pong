// Constants
const canvas = document.getElementById("game");
const pScore = document.getElementById("pscore");
const cScore = document.getElementById("cscore");
const winner = document.getElementById("winner");
const ctx = canvas.getContext("2d");
const barHeight = 80;
const barWidth = 10;
const barSpeed = 4;
const ballRadius = 5;
const cpuSpeed = 3;
const scoreLimit = 20;

// Variables
let playerY = (canvas.height - barHeight) / 2;
let cpuY = (canvas.height - barHeight) / 2;
let playerScore = 0;
let cpuScore = 0;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6;
let ballSpeedY = 6;
let keysPressed = {};

// Sound Effects (All retrieved from freesound.org, I do not own any of these)
const wallSE = new Audio("./Resources/wall.wav");
const paddleSE = new Audio("./Resources/paddle.wav");
const pointSE = new Audio("./Resources/point.wav");
const winSE = new Audio("./Resources/win.wav");
const loseSE = new Audio("./Resources/lose.wav");


document.addEventListener("keydown", function(event) {
	keysPressed[event.key] = true;
});
document.addEventListener("keyup", function(event) {
	keysPressed[event.key] = false;
});

function update() {
	if (playerScore == scoreLimit - 1 || cpuScore == scoreLimit - 1) {
		winner.innerHTML = "Match Point";
	}
	
	if (playerScore == scoreLimit) {
		winSE.play();
		winner.innerHTML = "Game Over. Player Wins!";
		setTimeout(()=> {
			alert("Player Wins!");
		}, 200);
		cancelAnimationFrame();
	} else if (cpuScore == scoreLimit) {
		loseSE.play();
		winner.innerHTML = "Game Over. CPU Wins!";
		setTimeout(()=> {
			alert("CPU Wins!");
		}, 200);
		cancelAnimationFrame();
	}
	// Move p1
	if (keysPressed["w"] && playerY > 0) {
		playerY -= barSpeed; // player move speed
	} else if (keysPressed["s"] && playerY < canvas.height - barHeight) {
		playerY += barSpeed;
	}
		
	//move cpu
	if (!(ballY < cpuY + barHeight/2 - 30 && ballY > cpuY + barHeight/2 + 30)) { // To *reduce* cpu jitter
		if (ballY > cpuY + barHeight/2 && cpuY < canvas.height - barHeight) {
			cpuY += cpuSpeed; // cpu move speed
		} else if (ballY < cpuY + barHeight/2 && cpuY > 0) {
			cpuY -= cpuSpeed;
		}
	}
	
	//move ball
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	//ball collision top bottom
	if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
		wallSE.play();
		ballSpeedY *= -1;
	}
	
	//ball collision sides
	if (ballX - ballRadius < 0) {
		cpuScore += 1;
		cScore.innerHTML = cpuScore;
		if (playerScore != scoreLimit && cpuScore != scoreLimit) {
			pointSE.play();
			setTimeout(()=> {
				alert("cpu scored a point");
			}, 10);
		}
		reset();
	} else if (ballX + ballRadius > canvas.width) {
		playerScore += 1;
		pScore.innerHTML = playerScore;
		if (playerScore != scoreLimit && cpuScore != scoreLimit) {
			pointSE.play();
			setTimeout(()=> {
				alert("Player scored a point");
			}, 10);
		}
		reset();
	}
	
	//ball collision paddles
	if (ballX - ballRadius < barWidth && ballY > playerY && ballY < playerY + barHeight) {
		paddleSE.play();
		ballSpeedX *= -1;
		ballSpeedY = Math.floor(Math.random() * 10) - 5;
	} else if (ballX + ballRadius > canvas.width - barWidth && ballY > cpuY && ballY < cpuY + barHeight) {
		paddleSE.play();
		ballSpeedX *= -1;
		ballSpeedY = Math.floor(Math.random() * 10) - 5;
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "white";
	//ctx.fillRect(ballX, ballY, 10, 10); // Rectangle Not Working
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.fillRect(0, playerY, barWidth, barHeight); // Player
	ctx.fillRect(canvas.width - barWidth, cpuY, barWidth, barHeight); // CPU
}

function reset() {
	playerY = (canvas.height - barHeight) / 2;
	cpuY = (canvas.height - barHeight) / 2;
	keysPressed["w"] = false;
	keysPressed["s"] = false;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	ballSpeedX *= -1;
	ballSpeedY = Math.floor(Math.random() * 8) - 4;
}

function run() {
	update();
	draw();
	requestAnimationFrame(run);
}
alert("This game is best experienced in fullscreen!\nCertain elements may seem distorted if not in fullscreen!");
winner.innerHTML += scoreLimit;
run();