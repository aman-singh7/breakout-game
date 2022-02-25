const grid = document.querySelector('.grid')
const currScore = document.querySelector('#score #value')
const highScore = document.querySelector('#highscore #value')
const verdict = document.querySelector('#verdict #message')

const blockHeight = 20
const blockWidth = 100
const boardWidth = 670
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
    checkForCollisions()
}

function checkForCollisions() {
    //check for block collisions
    for(let i=0;i<blocks.length;i++){
        if(
            (ball.x>blocks[i].bottomLeft.x && ball.x < blocks[i].bottomRight.x) &&
            ((ball.y + 2*ball.radius) > blocks[i].bottomLeft.y && ball.y < blocks[i].topLeft.y)
        ){
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i,1)
            changeDirection()
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
    }
    
    //check for wall collisions
    if(ball.x >= (boardWidth - 2*ball.radius) || 
    ball.y >= (boardHeight - 2*ball.radius)||
    ball.x <=0
    ){
        changeDirection()
    }

    //check for board collision
    if(
        (ball.x > paddle.x && ball.x < paddle.x + blockWidth) &&
        (ball.y > paddle.y && ball.y < paddle.y + blockHeight)
    ){
        // ballBoardCollision() 
        changeDirection()
    }

    // check for game over
    if(ball.y <= 0){
        clearInterval(timerId)
        verdict.innerHTML = 'You lose'
        document.removeEventListener('keydown', moveBoard)
    }
}



function changeDirection() {
    if(ball.dx === 4 && ball.dy === 4){
        ball.dy = -4
        return
    }
    if(ball.dx === 4 && ball.dy === -4){
        ball.dx = -4
        return
    }
    if(ball.dx == -4 && ball.dy === -4){
        ball.dy = 4
        return
    }
    if(ball.dx === -4 && ball.dy === 4){
        ball.dx = 4
        return
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