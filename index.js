const grid = document.querySelector('.grid')
const currScore = document.querySelector('#score #value')
const highScore = document.querySelector('#highscore #value')
const verdict = document.querySelector('#verdict #message')
const coordinate = document.querySelector('#coordinate')

const blockHeight = 20
const blockWidth = 100
const boardWidth = 675
const boardHeight = 400
const columnsCount = 6
const rowsCount = 3
let timerId
let score = 0

// Board
const paddleElement = document.createElement('div')
paddleElement.classList.add('paddle')
grid.appendChild(paddleElement)

let paddle = {
    x: 230,
    y: 10,
    width: 100,
    height: 20,
}

// Ball
const ballElement = document.createElement('div')
ballElement.classList.add('ball')
grid.appendChild(ballElement)

let ball = {
    x: 230,
    y: 30,
    radius: 10,
    dx: 4,
    dy: 4,
}

class Block{
    constructor(xAxis, yAxis){
        this.bottomLeft = {
            x: xAxis,
            y: yAxis
        }
        this.bottomRight = {
            x: xAxis +  blockWidth,
            y: yAxis
        }
        this.topLeft = {
            x: xAxis,
            y: yAxis + blockHeight
        }
        this.topRight = {
            x: xAxis + blockWidth,
            y: yAxis + blockHeight
        }
    }
}


let blocks = []

function createBlocks() {
    let padding = 10
    for(let row = 1;row<= rowsCount ;row++){
        let top = boardHeight - (blockHeight + padding)*row     // 10 is for padding
        for(let col = 0;col < columnsCount ;col++){
            let left = blockWidth*col + padding*(col+1)     // 10 is for padding
            blocks.push(new Block(left,top))
        }
    }
}

function addBlocks() {
    for(let i=0;i<blocks.length;i++){
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft.x + 'px'
        block.style.bottom = blocks[i].bottomLeft.y + 'px'
        grid.appendChild(block)
    }
}


function drawBoard() {
    paddleElement.style.left = paddle.x + 'px'
    paddleElement.style.bottom = paddle.y + 'px'
}

function drawBall() {
    ballElement.style.left = ball.x + 'px'
    ballElement.style.bottom = ball.y + 'px'
}

function moveBoard(e) {
    switch(e.key){
        case 'ArrowLeft':
            if(paddle.x > 0){
                paddle.x -= 10
                drawBoard()
            }
            break;
        case 'ArrowRight':
            if(paddle.x < (boardWidth-blockWidth)){
                paddle.x += 10
                drawBoard();
            }
            break;
    }
}

function moveBall() {
    ball.x += ball.dx
    ball.y += ball.dy
    drawBall()
    detectCollision()
    detectBrickCollision()
}

function detectCollision() {
    const hitTop = () => ball.y > boardHeight - 2 * ball.radius;
    const hitBottom = () => ball.y < 0;
    const hitLeftWall = () => ball.x < 0;
    const hitRightWall = () => ball.x + ball.radius * 2 > boardWidth;
    const hitPaddle = () =>
        ball.x > paddle.x && 
        ball.x < paddle.x + paddle.width &&
        ball.y > paddle.y && 
        ball.y < paddle.y + paddle.height;

    if (hitLeftWall()) {
        ball.dx = -ball.dx;
        ball.x = 0;
    }        
    if (hitRightWall()) {
        ball.dx = -ball.dx;
        ball.x = boardWidth - 2 * ball.radius;
    }
    if (hitTop()) {
        ball.dy = -ball.dy;
    }
    if (hitBottom()) {
        clearInterval(timerId)
        verdict.innerHTML = 'You lose'
        document.removeEventListener('keydown', moveBoard)
    }

    if (hitPaddle()) {
        ball.dy = -ball.dy;
        const drawingConst = 5
        const paddleMiddle = 2;
        const algo = (((ball.x - paddle.x) / paddle.width) * drawingConst) | 0;
        ball.dx = ball.dx + algo - paddleMiddle;
    }
}

function detectBrickCollision() {
    let index = 0;
    let directionChanged = false;
    const isBallCollide = (block) =>
        ball.x > block.bottomLeft.x &&
        ball.x < block.bottomRight.x &&
        ball.y + 2*ball.radius > block.bottomLeft.y &&
        ball.y < block.topLeft.y

    blocks.forEach((block) => {
        if(isBallCollide(block)){
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            
            allBlocks[index].classList.remove('block')
            blocks.splice(index,1)
            if (!directionChanged) {
                directionChanged = true;
                detectCollisionDirection(block);
            }
            score++
            currScore.innerHTML = score
            highScore.innerHTML = Math.max(highScore.innerHTML, score)

            //check for win
            if (blocks.length == 0){
                verdict.innerHTML = 'You Won'
                clearInterval(timerId)
                document.removeEventListener('keydown', moveBoard)
            }
        }
        index++;
    });
}

function detectCollisionDirection(brick) {
    const hitFromLeft = () => ball.x + 2 * ball.radius - ball.dx <= brick.bottomLeft.x;
    const hitFromRight = () => ball.x - ball.dx >= brick.bottomRight.x;

    if (hitFromLeft() || hitFromRight()) {
      ball.dx = -ball.dx;
    } else { // Hit from above or below
      ball.dy = -ball.dy;
    }
}

function startGame() {
    blocks = []
    createBlocks()

    addBlocks()
    drawBoard()
    drawBall()

    document.addEventListener('keydown', moveBoard)
    timerId = setInterval(moveBall, 30)
}

startGame()