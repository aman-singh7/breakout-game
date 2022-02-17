const userName = prompt('Enter your name')

const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const nameDisplay = document.querySelector('#name')
nameDisplay.innerHTML = `Welcome ${userName}!`
const blockHeight = 20
const blockWidth = 100
const boardWidth = 560
const boardHeight = 300
const ballDiameter = 20
const columnsCount = 5
const rowsCount = 3
let timerId
let xDirection = 2
let yDirection = 2
let score = 0

const boardStart = [230, 10]
let currentPosition = boardStart

const ballStart = [230, 30]
let ballCurrentPosition = ballStart

// Board
const board = document.createElement('div')
board.classList.add('user')
grid.appendChild(board)

// Ball
const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)

class Block{
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis+blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis+blockHeight]
        this.topRight = [xAxis+blockWidth, yAxis+blockHeight]
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
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block)
    }
}


function drawBoard() {
    board.style.left = currentPosition[0] + 'px'
    board.style.bottom = currentPosition[1] + 'px'
}

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

function moveBoard(e) {
    switch(e.key){
        case 'ArrowLeft':
            if(currentPosition[0] > 0){
                currentPosition[0] -= 10
                drawBoard()
            }
            break;
        case 'ArrowRight':
            if(currentPosition[0] < (boardWidth-blockWidth)){
                currentPosition[0] += 10
                drawBoard();
            }
            break;
    }
}

function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}

function ballWallCollision() {

}

function ballBoardCollision() {
    let collisionPoint = ballCurrentPosition[0] - (currentPosition[0] + boardWidth/2)

    collisionPoint = collisionPoint / (boardWidth/2)

    let angle = collisionPoint* Math.PI/3
    console.log(angle)

    xDirection = 2*Math.sin(angle)
    yDirection = -2*Math.cos(angle)

}

function checkForCollisions() {
    //check for block collisions
    for(let i=0;i<blocks.length;i++){
        if(
            (ballCurrentPosition[0]>blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ){
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i,1)
            changeDirection()
            score++
            scoreDisplay.innerHTML = `Score:\t${score}`

            //check for win
            if (blocks.length == 0){
                scoreDisplay.innerHTML = 'You Win'
                clearInterval(timerId)
                document.removeEventListener('keydown', moveBoard)
            }
        }
    }
    
    //check for wall collisions
    if(ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
    ballCurrentPosition[1] >= (boardHeight - ballDiameter)||
    ballCurrentPosition[0] <=0
    ){
        changeDirection()
    }

    //check for board collision
    if(
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ){
        // ballBoardCollision() 
        changeDirection()
    }

    // check for game over
    if(ballCurrentPosition[1] <= 0){
        clearInterval(timerId)
        scoreDisplay.innerHTML = 'You lose'
        document.removeEventListener('keydown', moveBoard)
    }
}



function changeDirection() {
    if(xDirection === 2 && yDirection === 2){
        yDirection = -2
        return
    }
    if(xDirection === 2 && yDirection === -2){
        xDirection = -2
        return
    }
    if(xDirection == -2 && yDirection === -2){
        yDirection = 2
        return
    }
    if(xDirection === -2 && yDirection === 2){
        xDirection = 2
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