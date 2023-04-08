import './style.css';
const levels = [
  {
    speed: 1,
    bricksTypes: [0],
    bricksRowsCount: 3,
  },
];

const gameSettings = {
  ball: {
    ballRadius: 10,
    color: '#0000ff',
  },
  paddle: {
    height: 15,
    width: 65,
  },
};

var canvas = document.getElementById('arcanoid');
var ctx = canvas.getContext('2d');
var x = canvas.width / 2;
var y = canvas.height - 30;

var dx = 2;
var dy = -2;

var ballRadius = 10;

var paddleHeight = 15;
var paddleWidth = 65;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 7;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#572500';
  ctx.fillText('Score: ' + score, 8, 20);
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
        ctx.fillStyle = '#aa2300';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.arc;
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y > canvas.height - ballRadius) {
    // alert("Game Over");
    clearInterval(drawingInterval);
    return;
  } else if (y > canvas.height - paddleHeight - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
  }

  x += dx;
  y += dy;

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

var drawingInterval = setInterval(draw, 10);

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
  if (event.keyCode == 39) {
    rightPressed = true;
  } else if (event.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.keyCode == 39) {
    rightPressed = false;
  } else if (event.keyCode == 37) {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (
        b.status == 1 &&
        x + ballRadius > b.x &&
        x + ballRadius < b.x + brickWidth &&
        y - ballRadius > b.y &&
        y - ballRadius < b.y + brickHeight
      ) {
        dy = -dy;
        b.status = 0;
        score++;
        if (score == brickRowCount * brickColumnCount) {
          alert('YOU WIN, CONGRATULATIONS!');
          document.location.reload();
        }
      }
    }
  }
}
