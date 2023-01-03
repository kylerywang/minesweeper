/*----- constants -----*/
// const PLAYERS = {
//     '1': {
//         name: 'Player 1',
//         symbol: 'X',
//         color: 'red'
//     },
//     '-1': {
//         name: 'Player 2',
//         symbol: 'O',
//         color: 'blue'
//     }
// }

// const WIN_COMBOS = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6]
// ]

const NUM_BOMBS = 10;

/*----- app's state (variables) -----*/
let gameStatus, boardRevealed, boardAdjBombs, bombIdxes;

//boardRevealed is 0, 1, or -1. 0 is not revealed, 1 is revealed, -1 is flagged

/*----- cached element references -----*/
const h2El = document.querySelector('h2')
const boardEl = document.getElementById('board')
const resetBtnEl = document.createElement("button")


/*----- event listeners -----*/
boardEl.addEventListener('click', handleBoardClick)
boardEl.addEventListener('contextmenu', handleBoardRightClick)
resetBtnEl.addEventListener('click', handleReset);


/*----- functions -----*/
function init() {
    boardRevealed = new Array(100).fill(0);
    boardAdjBombs = new Array(100).fill(null)
    bombIdxes = [];
    gameStatus = "notStarted"
    render()
}

function render() {
    renderMessage()
    renderBoard()
    if (gameStatus === "gameOver"){
        renderResetBtn();
    }
}

function handleBoardClick(evt) {
    let idx = parseInt(evt.target.id);
    if (gameStatus === "notStarted"){
        generateBoard(idx);

    }
    if (isBomb(idx)){
        loss();
    }

    
    reveal(idx)
    checkWin()
    render()
}

function reveal(idx){
    boardRevealed[idx] = 1;
    if (boardAdjBombs[idx] === 0){
        reveal(idx+1);
    }
}

function checkWin(){

    // if all non-bomb squares revealed, then call serwin()
}

function handleBoardRightClick(evt){
    evt.preventDefault();
    let idx = evt.target.id;
    if (gameStatus === "started"){
        boardRevealed[idx] = -1;
    }
    render()
}

function generateBoard(idx){
    while(bombIdxes.length < NUM_BOMBS){
        let randNum = Math.floor(Math.random() * 100);
        if((bombIdxes.indexOf(randNum) === -1) && (randNum !== idx) && (randNum !== idx+1)&& (randNum !== idx- 1)&& (randNum !== idx+10)&& (randNum !== idx+9)&& (randNum !== idx+11)&& (randNum !== idx-10)&& (randNum !== idx-11)&& (randNum !== idx-9)) {
            bombIdxes.push(randNum);
        }
    }
    for (i = 0 ; i <boardAdjBombs.length; i++){
        boardAdjBombs[i] = 0
        isBomb(i+1) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
        isBomb(i-1) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
        isBomb(i+10) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
        isBomb(i+9) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
        isBomb(i+11) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
        isBomb(i-10) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
        isBomb(i-11) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
        isBomb(i-9) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
    }
    gameStatus = "started";
}

function renderMessage() {
    h2El.innerText = gameStatus;
}

function isBomb(idx){
// takes int, returns true if square at idx is a bomb
   return bombIdxes.includes(idx)
}

function renderBoard() {
    for (let square of boardEl.children) {
         const idx = parseInt(square.id)
        if(boardRevealed[idx] === 1) {
            if(isBomb(idx)){
                square.innerText = "BOMB!"
            } else{
                square.innerText = boardAdjBombs[idx].toString();
            }
        } else if (boardRevealed[idx] === -1 ){
            square.innerText = "flag"
        } else if (boardRevealed[idx] === 0){
            square.innerText = ""
        }
        }
}

function loss(){
    gameStatus = "gameOver";
}

function win(){
    gameStatus = "gameOver";
}



function renderResetBtn(){
    resetBtnEl.innerText = "Play Again"
    document.querySelector("body").append(resetBtnEl);
}

function handleReset(){
    resetBtnEl.remove()
    init()
}

// Start the Game!
init() 