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

const NUM_BOMBS = 13;

/*----- app's state (variables) -----*/
let gameStatus, boardRevealed, boardAdjBombs, bombIdxes;

//boardRevealed is 0, 1, or -1. 0 is not revealed, 1 is revealed, -1 is flagged
//gameStatus is "notStarted", "started", "win", "loss"

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
    if (gameStatus === "win" || "loss"){
        renderResetBtn();
    }
}

function handleBoardClick(evt) {
    let idx = parseInt(evt.target.id);
    if (gameStatus === "notStarted"){
        generateBoard(idx);
        reveal(idx)
    }    
    if (gameStatus === "started"){
        if (isBomb(idx)){
            loss();
        };
        reveal(idx)
        checkWin()
    }
    render()
}

function reveal(idx){
    if (idx<0 || idx > 99){
        return
    }
    boardRevealed[idx] = 1;
    if (boardAdjBombs[idx] === 0 && !isBomb(idx)){
        let remainder = idx%10;
        switch(remainder){
            case 0:
                if (!boardRevealed[idx+1]){
                    reveal(idx+1);
                }

                if (!boardRevealed[idx+10]){
                    reveal(idx+10);
                } 

                if (!boardRevealed[idx+11]){
                    reveal(idx+11);
                } 
                if (!boardRevealed[idx-10]){
                    reveal(idx-10);
                } 
                if (!boardRevealed[idx-9]){
                    reveal(idx-9);
                } 
                break;
            case 9:

                if (!boardRevealed[idx-1]){
                    reveal(idx-1);
                }

                if (!boardRevealed[idx-11]){
                    reveal(idx-11);
                } 

                if (!boardRevealed[idx+10]){
                    reveal(idx+10);
                } 
                if (!boardRevealed[idx+9]){
                    reveal(idx+9);
                } 
                if (!boardRevealed[idx-10]){
                    reveal(idx-10);
                } 

                break;
            default:
                if (!boardRevealed[idx+1]){
                    reveal(idx+1);
                }
                if (!boardRevealed[idx-1]){
                    reveal(idx-1);
                }
                if (!boardRevealed[idx-10]){
                    reveal(idx-10);
                } 
                if (!boardRevealed[idx-11]){
                    reveal(idx-11);
                } 
                if (!boardRevealed[idx-9]){
                    reveal(idx-9);
                } 
                if (!boardRevealed[idx+10]){
                    reveal(idx+10);
                } 
                if (!boardRevealed[idx+9]){
                    reveal(idx+9);
                } 
                if (!boardRevealed[idx+11]){
                    reveal(idx+11);
                } 
        }
    }
}


function checkWin(){ 
    let tally = boardRevealed.filter(x => x===1).length
    console.log(tally)
    if (tally === (100 - NUM_BOMBS)){
        win()
    }

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
        let remainder = i%10;
        switch(remainder){
            case 0:
                isBomb(i+1) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i+10) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i+11) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i-10) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i-9) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                break;
            case 9:
                isBomb(i-1) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i+10) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i+9) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i-10) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i-11) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                break;
            default:
                isBomb(i+1) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i-1) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i+10) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i+9) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i+11) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i-10) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i-11) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0
                isBomb(i-9) ? boardAdjBombs[i]++ : boardAdjBombs[i] = boardAdjBombs[i]+0

    }
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
    gameStatus = "loss";
}

function win(){
    gameStatus = "win";
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