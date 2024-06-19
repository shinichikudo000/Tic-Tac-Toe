const botInput = document.getElementById('bot')
const humanInput = document.getElementById('human')
const player1Name = document.getElementById('player1-name')
const player2Name = document.getElementById('player2-name')
const player1Mark = document.getElementById('player1-mark')
const player2Mark = document.getElementById('player2-mark')


let startFormModal = (() => {
    const homeStartButton = document.getElementById('start-button');
    const startGameButton = document.getElementById('start-button-modal')
    const formOverlay = document.getElementById('player-form-modal-overlay');
    const playerForm = document.getElementById('player-form')
    const homePage = document.getElementById('home-page')
    const gameWindow = document.getElementById('game-window')
    homeStartButton.addEventListener('click', () => {
        formOverlay.style.display = 'flex'
    })

    botInput.addEventListener('change', () => {
        if(botInput.checked) {
            player2Name.setAttribute('disabled', 'disabled')
            player2Mark.setAttribute('disabled', 'disabled')
            startGameButton.removeAttribute('disabled')
        }
    })

    humanInput.addEventListener('change', () => {
        if(humanInput.checked) {
            player2Name.removeAttribute('disabled')
            player2Mark.removeAttribute('disabled')
            checkSelection()
        } else {
            player2Name.removeAttribute('disabled')
            player2Mark.removeAttribute('disabled')
        }
    })

    let checkSelection = () => {
        if(player1Mark.value === player2Mark.value && !botInput.checked) {
            startGameButton.setAttribute('disabled', 'disabled')
        } else {
            startGameButton.removeAttribute('disabled')
        }
    }

    player1Mark.addEventListener('change', checkSelection)
    player2Mark.addEventListener('change', checkSelection)

    function showGameWindow() {
        formOverlay.style.display = 'none'
        homePage.style.display = 'none'
        gameWindow.style.display = 'flex'
    }
    
    startGameButton.addEventListener('click', showGameWindow)
    playerForm.addEventListener('submit', e => {
        e.preventDefault()
        showGameWindow()
        formHandler.getPlayer()
        gameBoard.printGameBoard()
    })
})();

//gameboard module

class Player {
    constructor(name, mark, playerMoves, winCount, isBot) {
        this.name = name
        this.mark = mark
        this.playerMoves = playerMoves
        this.winCount = winCount
        this.isBot = isBot
    }
}

let gameBoard = (() => {
    const gameBoardDiv = document.getElementById('game-board')

    let gameBoardState = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]

    let clearFirstChild = (element) => {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    let printGameBoard = () => {
        clearFirstChild(gameBoardDiv)
        gameBoardState.forEach((row, rowIndex) => {
            const boardRow = document.createElement('div')
            gameBoardDiv.appendChild(boardRow)
            boardRow.classList.add('game-board-row')
            row.forEach((cell, cellIndex) => {
                boardRow.innerHTML += `<div class="board-cell" id=${rowIndex}${cellIndex}>${cell}</div>`
            })
        })
    }

    let move = (value, id) => ({value, id})

    gameBoardDiv.addEventListener('click', (e)=> {
        let target = e.target
        let targetValue = e.target.innerText
        let [x, y] = target.id.split('')

        if(targetValue === 'X' || targetValue === 'O' && gameFlow.isWon === false) {
            printGameBoard()
        } else if(targetValue === '' && gameFlow.moveCount % 2 !== 0 && gameFlow.isWon === false) {
            gameBoardState[x][y] = gameFlow.players[1].mark,
            gameFlow.players[1].playerMoves.push(move(gameFlow.players[1].mark, target.id))
            gameFlow.historyMoveArray.push(move(gameFlow.players[1].mark, target.id))
            gameFlow.moveCount++
            printGameBoard()
            gameFlow.checkMoves(gameFlow.players[0].playerMoves)
            gameFlow.checkMoves(gameFlow.players[1].playerMoves)
        } else if(targetValue === '' && gameFlow.isWon === false) {
            gameBoardState[x][y] = gameFlow.players[0].mark,
            gameFlow.players[0].playerMoves.push(move(gameFlow.players[0].mark, target.id))
            gameFlow.historyMoveArray.push(move(gameFlow.players[0].mark, target.id))
            gameFlow.moveCount++
            printGameBoard()
            gameFlow.checkMoves(gameFlow.players[0].playerMoves)
            gameFlow.checkMoves(gameFlow.players[1].playerMoves)
        } else if (gameFlow.isWon === true) {
            //code later
        }

        if (gameFlow.players[0].playerMoves.length + gameFlow.players[1].playerMoves.length === 9 && gameFlow.isWon === false) {
            endRound.tieModal()
            gameFlow.tie = true
            history.printRoundHistory()
        }

        //console.log(target)
        //console.log(gameFlow.players[1].playerMoves)
        //console.log(gameFlow.players[0].playerMoves)
        //console.log(gameFlow.isWon)
        console.log(gameFlow.moveCount)
        //console.log(gameBoardState)
    })
    // split id of the target then make it in the board game state

    return {
        gameBoardState,
        printGameBoard,
        clearFirstChild
    }
})();


let formHandler = (() => {
    let getPlayer = () => {
        let p1 = new Player(player1Name.value, player1Mark.value, [], 0, false)
        let p2 = new Player(player2Name.value, player2Mark.value, [], 0, false) 
        
        if (botInput.checked) {
            p2.name = "Bot"
            p2.isBot = true
        }

        gameFlow.players.push(p1)
        gameFlow.players.push(p2)
        
        let p1NameContainer = document.getElementById('player1-name-container')
        let p2NameContainer = document.getElementById('player2-name-container')

        p1NameContainer.innerText = p1.name
        p2NameContainer.innerText = p2.name

        //console.log(gameFlow.players) 
    } 

    return {
        getPlayer
    }
})();

let gameFlow = (() => {
    let players = []
    let moveCount = 0
    let isWon = false //last index will be the current move
    let historyMoveArray = [] // backup array for the moves for previous and next
    let winner 
    let tie = false
    let round = 1

    let checkMoves = (array) => {
        let arrayOfId = array.map(obj => obj.id);
    
        const winningCombinations = [
            ['00', '01', '02'], ['10', '11', '12'], ['20', '21', '22'],
            ['00', '10', '20'], ['01', '11', '21'], ['02', '12', '22'], 
            ['20', '11', '02'], ['00', '11', '22']            
        ];
    
        let winningIndex = -1; 

        for (let index = 0; index < winningCombinations.length; index++) {
            const combination = winningCombinations[index];
            if (combination.every(id => arrayOfId.includes(id))) {
                winningIndex = index
                win(winningCombinations[index])
                break; 
            }
        }
        //console.log(winningIndex)
    };

    let win = (winningIndex) => {
        //playerWinMessage(); // show modal where they can click continue or check the history.
        //if continue clear board . if check history just close the modal show the buttons
        endRound.congratsModal()
        isWinningBoard(winningIndex)
        addPoint();
        gameFlow.isWon = true;
        history.printRoundHistory()
        gameFlow.round += 1
        history.historyReview.style.display = 'block'
    }

    
    let isWinningBoard = (winningIndex) => {
        winningIndex.forEach(index => {
            let [x, y] = index.split('');
            const element = document.getElementById(`${x}${y}`);
            if (element) {
                element.classList.add('winning-board');
            }
        });
    }

    let removeWinningBoard = (winningIndex) => {
        winningIndex.forEach(index => {
            let [x, y] = index.split('');
            const element = document.getElementById(`${x}${y}`);
            if (element) {
                element.classList.remove('winning-board');
            }
        });
    }

    let addPoint = () => {
        let p1Score = document.getElementById('player1-score-container')
        let p2Score = document.getElementById('player2-score-container')

        if (gameFlow.moveCount % 2 === 0) {
            gameFlow.players[1].winCount++
            gameFlow.moveCount = 0
            console.log(gameFlow.moveCount)
            gameBoard.clearFirstChild(p2Score)
            p2Score.innerText = players[1].winCount
            gameFlow.winner = gameFlow.players[1].name
        } else if (gameFlow.moveCount % 2 !== 0) {
            gameFlow.players[0].winCount++
            gameFlow.moveCount = 1
            console.log(gameFlow.moveCount)
            gameBoard.clearFirstChild(p1Score)
            p1Score.innerText = players[0].winCount
            gameFlow.winner = gameFlow.players[0].name
        }

    }

    return {
        players,
        moveCount,
        isWon,
        historyMoveArray,
        tie, 
        winner,
        round,
        checkMoves,
        isWinningBoard,
        removeWinningBoard
    }
})();

let endRound = (() => {
    let previousButton = document.getElementById('previous-button')
    let redoButton = document.getElementById('redo-button')
    let continueGameButton = document.getElementById('continue-game')
    let winloseModal = document.getElementById('win-lose-modal')
    let messageContainer = document.getElementById('message')
    let reviewGameButton = document.getElementById('review-game-button')
    let resetButtonModal = document.getElementById('reset-button-modal')
    let resetButton = document.getElementById('reset-button')
    let continueButtonModal = document.getElementById('continue-button-modal')
    
    let historyArrayDuplicate = []

    let congratsModal = () => {
        if(gameFlow.moveCount % 2 === 0) {
            gameBoard.clearFirstChild(messageContainer)
            messageContainer.innerText = `${gameFlow.players[1].name} win!`
        } else if (gameFlow.moveCount % 2 !== 0) {
            gameBoard.clearFirstChild(messageContainer)
            messageContainer.innerText = `${gameFlow.players[0].name} win!`
        }
        winloseModal.style.display = 'flex'
    }
    let tieModal = () => {
        gameBoard.clearFirstChild(messageContainer)
        messageContainer.innerText = "It's a tie!"
        winloseModal.style.display = 'flex'
    }

    previousButton.addEventListener('click', () => {
        if(gameFlow.historyMoveArray.length <= 1) {
            let lastMove = gameFlow.historyMoveArray.pop()
            historyArrayDuplicate.push(lastMove)
            let [x, y] = lastMove.id.split('')
            gameBoard.gameBoardState[x][y] = ''
            gameBoard.printGameBoard()
            previousButton.setAttribute('disabled', 'disabled')
        } else {
            let lastMove = gameFlow.historyMoveArray.pop()
            historyArrayDuplicate.push(lastMove)
            let [x, y] = lastMove.id.split('')
            gameBoard.gameBoardState[x][y] = ''
            gameBoard.printGameBoard()
            redoButton.removeAttribute('disabled')
        }
    })

    redoButton.addEventListener('click', () => {
        if(historyArrayDuplicate.length <= 1) {
            let lastMove = historyArrayDuplicate.pop()
            gameFlow.historyMoveArray.push(lastMove)
            let [x, y] = lastMove.id.split('')
            gameBoard.gameBoardState[x][y] = lastMove.value
            gameBoard.printGameBoard()
            redoButton.setAttribute('disabled', 'disabled')
        } else {
            let lastMove = historyArrayDuplicate.pop()
            gameFlow.historyMoveArray.push(lastMove)
            let [x, y] = lastMove.id.split('')
            gameBoard.gameBoardState[x][y] = lastMove.value
            gameBoard.printGameBoard()
            previousButton.removeAttribute('disabled')
        }
    })

    continueGameButton.addEventListener('click', () => {
        continueGame()
        clearBoard()
    })
    

    let continueGame = () => {
        gameFlow.isWon = false
        gameFlow.tie = false
        gameFlow.historyMoveArray = []
        historyArrayDuplicate = []
        gameFlow.players[0].playerMoves = []
        gameFlow.players[1].playerMoves = []
        continueGameButton.style.display = 'none'
        redoButton.style.display = 'none'
        previousButton.style.display = 'none'
    }

    reviewGameButton.addEventListener('click', () => {
        winloseModal.style.display = 'none'
        continueGameButton.style.display = 'flex'
        redoButton.style.display = 'flex'
        previousButton.style.display = 'flex'
        redoButton.setAttribute('disabled', 'disabled')
    })

    continueButtonModal.addEventListener('click', () => {
        continueGame()
        clearBoard()
        winloseModal.style.display = 'none'
        continueGameButton.style.display = 'none'
        redoButton.style.display = 'none'
        previousButton.style.display = 'none'
    })

    let reset = () => {
        clearBoard()
        continueGame()
        winloseModal.style.display = 'none'
        gameFlow.players[0].winCount = 0
        gameFlow.players[1].winCount = 0
        //reset the history
        let p1Score = document.getElementById('player1-score-container')
        let p2Score = document.getElementById('player2-score-container')

        gameBoard.clearFirstChild(p1Score)
        gameBoard.clearFirstChild(p2Score)

        p1Score.innerText = "0"
        p2Score.innerText = "0"

        history.nullHistoryArray()

        gameFlow.tie = false

        previousButton.removeAttribute('disabled')
        redoButton.removeAttribute('disabled')

        gameFlow.round = 1

        history.historyReview.style.display = 'none'
    }

    resetButtonModal.addEventListener('click', reset)
    resetButton.addEventListener('click', reset)
    //add event listener to 
    //3 buttons, continue, check moves(close the modal, show 2 buttons previous and next), exit game(will go back to homepage)\
    //continue game = history array null and the player moves null

    let clearBoard = () => {
        gameBoard.gameBoardState.forEach(row => {
            row.forEach((cell, cellIndex) => {
                row[cellIndex] = '';
            });
        });
        gameBoard.printGameBoard()
    }
    return {
        congratsModal,
        tieModal,
        continueGame,
        clearBoard,
        reset
    }
})();

let history = (() => {
    let round = (id, winner, object) => ({id, winner, object})
    let roundHistoryArray = []
    const roundHistoryContainer = document.getElementById('round-history-container')
    const historyReview = document.getElementById('history-review')
    const historyButton = document.getElementById('history-button-container')
    const closeHistoryButton = document.getElementById('close-history-button')

    let printRoundHistory = () => {
        if (gameFlow.isWon === true) {
            roundHistoryArray.push(round(gameFlow.round, gameFlow.winner, gameFlow.historyMoveArray))
            //gameFlow.round
        } else if (gameFlow.tie === true) {
            roundHistoryArray.push(round('Tie', gameFlow.historyMoveArray))
        }
        console.log(roundHistoryArray)
        gameBoard.clearFirstChild(roundHistoryContainer)
        roundHistoryArray.forEach(object => {
            let roundCotainerId = `round-${object.id}`
            roundHistoryContainer.innerHTML += 
            `<div class="history-container" id=${object.id}>
                <div class="round-container">Round ${object.id}: ${object.winner} </div>
                <div class="move-container" id=${roundCotainerId}></div>
            </div>`
            object.object.forEach(move => {
                const moveContainer = document.getElementById(`${roundCotainerId}`)
                let moveLabel = ''
                switch(move.id) {
                    case '00':
                        moveLabel = 'Top Left';
                        break;
                    case '01':
                        moveLabel = 'Top Middle'
                        break;
                    case '02':
                        moveLabel = 'Top Right'
                        break;
                    case '10':
                        moveLabel = 'Middle Left'
                        break;
                    case '11':
                        moveLabel = 'Center'
                        break;
                    case '12':
                        moveLabel = 'Middle Right'
                        break;
                    case '20':
                        moveLabel = 'Bottom Left'
                        break;
                    case '21':
                        moveLabel = 'Bottom Middle'
                        break;
                    case '22':
                        moveLabel = 'Bottom Right'
                        break;
                }
                moveContainer.innerHTML += `<div class = "move-label">${moveLabel}: ${move.value}</div>`
            })
        })
    
    }

    let nullHistoryArray = () => {
        roundHistoryArray = []
    }

    historyButton.addEventListener('click', () => {
        history.historyReview.style.transform = 'translateX(0)'
        history.closeHistoryButton.style.display = 'block'
    })

    closeHistoryButton.addEventListener('click', () => {
        history.historyReview.style.transform = 'translateX(-93%)'
        history.closeHistoryButton.style.display = 'none'
    })

    return {
        printRoundHistory,
        roundHistoryArray,
        closeHistoryButton,
        historyReview,
        nullHistoryArray
    }
})()



