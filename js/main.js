/*----- constants -----*/

const NUM_BOMBS = 13;

/*----- app's state (variables) -----*/
let gameStatus, boardRevealed, boardAdjBombs, bombIdxes, time;

//boardRevealed is 0, 1, or -1. 0 is not revealed, 1 is revealed, -1 is flagged
//gameStatus is "notStarted", "started", "win", "loss"

/*----- cached element references -----*/
const h2El = document.querySelector('h2')
const boardEl = document.getElementById('board')
const resetBtnEl = document.createElement("button")
const topBar = document.getElementById('top-bar')
const timerEl = document.createElement("h2")

/*----- event listeners -----*/
boardEl.addEventListener('click', handleBoardClick)
boardEl.addEventListener('contextmenu', handleBoardRightClick)
resetBtnEl.addEventListener('click', handleReset);


/*----- functions -----*/
function init() {
    time = 0;
    boardRevealed = new Array(100).fill(0);
    boardAdjBombs = new Array(100).fill(null)
    bombIdxes = [];
    gameStatus = "notStarted"
    render()
}

function render() {
    renderBoard()
    renderMessage()
    renderResetBtn();
    renderTimer();
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
        
    }
    checkWin()
    render()
}

function timer(){
    timerInterval = setInterval(incrementTimer,1000)
    function incrementTimer(){
        time++; 
        render()
    }
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
    if (tally === (100 - NUM_BOMBS)){
        win()
    }

}

function handleBoardRightClick(evt){
    evt.preventDefault();
    let idx = evt.target.id;
    if (gameStatus === "started" && boardRevealed[idx] === 0){
        boardRevealed[idx] = -1;
    } else if(gameStatus === "started" && boardRevealed[idx] === -1){
        boardRevealed[idx] = 0;
    }
    render()
}



function generateBoard(idx){
    timer()
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
    switch(gameStatus){
        case 'notStarted':
            h2El.innerText = "Click any square to start the game!";
            break;
        case 'started':
            h2El.innerText = " ";
            break;
        case 'win':
            h2El.innerText = "YOU WON.";
            break;
        case 'loss':    
            h2El.innerText = "YOU LOST."
            break;
    }
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
                square.innerText= "BOMB";
            } else{
                square.innerText = boardAdjBombs[idx].toString();
            }
        } else if (boardRevealed[idx] === -1 ){
            square.innerHTML = '\u2691';
        } else if (boardRevealed[idx] === 0){
            square.innerText = ""
        }
        }
}

function loss(){
    gameStatus = "loss";
    clearInterval(timerInterval);
}

function win(){
    gameStatus = "win";
    clearInterval(timerInterval);
}


function renderTimer(){
    timerEl.innerText = `${time}`
    topBar.append(timerEl);
}

function renderResetBtn(){
    resetBtnEl.innerText = "RESET"
    document.querySelector("body").append(resetBtnEl);
}

function handleReset(){
    resetBtnEl.remove()
    init()
}

// Start the Game!
init() 