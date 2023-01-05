const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.querySelector(".high-score")
let highScore = parseInt(localStorage.getItem("highScore"));
const reset = document.querySelector(".reset");

canvas.height = 600;
canvas.width = 500;

let RightPressed = false;
let LeftPressed = false;

document.addEventListener("keydown", keyDownHandlier);
document.addEventListener("keyup", keyUpHandlier);

if (isNaN(highScore)) {
    highScore = 0;
}

scoreDisplay.innerHTML = `High Score: ${highScore}`;

reset.addEventListener("click", ()=>{
    localStorage.setItem("highScore", "0");
    score = 0;
    scoreDisplay.innerHTML = "High Score: 0";
    drawBricks();
});

function keyDownHandlier(e){
    if (e.key == "Right" || e.key == "ArrowRight") {
        RightPressed = true;
    }else if (e.key == "Left" || e.key == "ArrowLeft") {
        LeftPressed = true;
    }
}

function keyUpHandlier(e){
    if (e.key == "Right" || e.key == "ArrowRight") {
        RightPressed = false;
    }else if (e.key == "Left" || e.key == "ArrowLeft") {
        LeftPressed = false;
    }
}

let score = 0;

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText("Score: " + score, 8,20);
}



function movePaddle(){
    if (RightPressed) {
        paddle.x += 7;
        if (paddle.x + paddle.width >= canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    } else if(LeftPressed){
        paddle.x -= 7;
        if (paddle.x < 0 ) {
            paddle.x = 0 ;
        }
    }
}





let speed = 3;

let ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 7,
    dx: speed,
    dy: -speed + 1,
    draw: function(){
        ctx.beginPath();
        ctx.fillStyle = "gold";
        ctx.arc(this.x,this.y,this.radius, 0, Math.PI * 2,);
        ctx.closePath();
        ctx.fill();
    }
};

let paddle = {
    height: 10,
    width: 80,
    x: canvas.width / 2 - 80 / 2,
    draw: function(){
        ctx.beginPath(); 
        ctx.roundRect(this.x, canvas.height - this.height, this.width, this.height, [0,0,20,20]);
        //ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.closePath();
        ctx.fill();  
    }
};



function play(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    paddle.draw();
    drawBricks();
    movePaddle();
    level();
    Collision();
    drawScore();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    //Обнуление счета
    if (ball.y + ball.radius > canvas.height) {
        if (score > parseInt (localStorage.getItem('highScore'))) {
            localStorage.setItem('highScore', score.toString());
            scoreDisplay.innerHTML = `High Score: ${score}`;
        }

        score = 0
        genBricks();
        ball.dx = speed;
        ball.dy = -speed +1;
    }



    // Попадание шара на платфому

    if (ball.x >= paddle.x && 
        ball.x <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height
        ) {
        ball.dy *= -1;
        //console.log("hit");
    }

    requestAnimationFrame(play);
}

let brickRowCount = 10;
let brickColumCount = 8;
let brickWidth = 50;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 20;

let bricks = [];

function genBricks(){
    for (let col = 0; col < brickColumCount; col++) {
        bricks[col] = [];
        for (let row = 0; row < brickRowCount; row++){
            bricks[col][row] = {x: 0, y: 0, status: 1 };        
        }    
    }
}

function drawBricks() {
    for (let col = 0; col < brickColumCount; col++) {
        for (let row = 0; row < brickRowCount; row++) {
            if (bricks[col][row].status == 1) {
                let brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath()
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
                //ctx.fillStyle = 'hsl(' + 360 * Math.random(0) + ', 100%, 50%)';
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.closePath();
            }    
        }    
    }
}

function Collision() {
    for (let col = 0; col < brickColumCount; col++) {
        for (let row = 0; row < brickRowCount; row++) {
            let b = bricks[col][row];
            if (b.status == 1) {
                if (ball.x >= b.x &&
                    ball.x <= b.x + brickWidth &&
                    ball.y >= b.y &&
                    ball.y <= b.y + brickHeight 
                    ) {
                    ball.dy *= -1;
                    b.status = 0;
                    score++;
                }
            }
            
        }
        
    }
}

let gameLevel = true;

function level() {
    if (score % 80 == 0 && score != 0 ) {
        if (ball.y > canvas.height / 2) {
            genBricks();
        }

        if (gameLevel) {
            if (ball.dy > 0) {
                ball.dy += 1
                gameLevel = false;
            } else if (ball.dy < 0) {
                ball.dy -= 1;
                gameLevel = false;
            }
        }

        if (score % 80 != 0 ) {
            gameLevel = true;
        }
    }

}
genBricks();
play();