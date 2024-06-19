let reset = (() => {
    let clearBoard = () => {
        gameBoardState.forEach( row => {
            row.map(() => "")
        })
    }
    return {
        clearBoard
    }
});

let checkMoves = (array) => {
    let arrayOfId = array.map(obj => obj.id)
    if (arrayOfId.includes(0o0) && arrayOfId.includes(0o1) && arrayOfId.includes(0o2)) {
        win()
        return;
    } else if (arrayOfId.includes(10) && arrayOfId.includes(11) && arrayOfId.includes(12)) {
        win()
        return;
    } else if (arrayOfId.includes(20) && arrayOfId.includes(21) && arrayOfId.includes(22)) {
        win()
        return;
    } else if (arrayOfId.includes(0o0) && arrayOfId.includes(10) && arrayOfId.includes(20)) {
        win()
        return;
    } else if (arrayOfId.includes(0o1) && arrayOfId.includes(11) && arrayOfId.includes(21)) {
        win()
        return;
    } else if (arrayOfId.includes(0o2) && arrayOfId.includes(12) && arrayOfId.includes(22)) {
        win()
        return;
    } else if (arrayOfId.includes(0o2) && arrayOfId.includes(11) && arrayOfId.includes(20)) {
        win()
        return;
    } else if (arrayOfId.includes(0o0) && arrayOfId.includes(11) && arrayOfId.includes(22)) {
        win()
        return;
    }
    console.log(arrayOfId)
}

let checkMovess = (array) => {
    let arrayOfId = array.map(obj => obj.id);

    const winningCombinations = [
        ['00', '01', '02'], ['10', '11', '12'], ['20', '21', '22'], // Rows
        ['00', '10', '20'], ['01', '11', '21'], ['02', '12', '22'], // Columns
        ['20', '11', '02'], ['00', '11', '22']             // Diagonals
    ];

    for (const combination of winningCombinations) {
        if (combination.every((id, index) => arrayOfId.includes(id))) {
            win();
            console.log(index)
            return;
        }
    }

    console.log(arrayOfId);
};

let moveContainer = document.querySelector('.move-container')
            object[1].forEach(move => {
                let moveLabel = ''
                switch(move[1]) {
                    case '00':
                        move = 'Top Left';
                        break;
                    case '01':
                        move = 'Top Middle'
                        break;
                    case '02':
                        move = 'Top Right'
                        break;
                    case '10':
                        move = 'Middle Left'
                        break;
                    case '11':
                        move = 'Center'
                        break;
                    case '12':
                        move = 'Middle Right'
                        break;
                    case '20':
                        move = 'Bottom Left'
                        break;
                    case '21':
                        move = 'Bottom Middle'
                        break;
                    case '22':
                        move = 'Bottom Right'
                        break;
                }
                moveContainer.innerHTML += `<div class = "move-label">${moveLabel}: ${move[0]}</div>`
            })


            roundHistoryArray.forEach(object => {
                // Create a new history container element
                const historyContainer = document.createElement('div');
                historyContainer.className = 'history-container';
                historyContainer.id = object.id;
                historyContainer.innerHTML = `
                    <div class="round-container">Round ${object.id}: ${object.winner}</div>
                    <div class="move-container ${object.id}"></div>
                `;
            
                // Append the history container to your document
                document.getElementById('your-container-id').appendChild(historyContainer); // Replace 'your-container-id' with the ID of the container where you want to add these history containers
            
                object.object.forEach(move => {
                    // Select the move container inside the history container
                    const moveContainer = document.querySelector(`#${object.id} .move-container.${object.id}`);
                    let moveLabel = '';
                    switch(move.id) {
                        case '00':
                            moveLabel = 'Top Left';
                            break;
                        case '01':
                            moveLabel = 'Top Middle';
                            break;
                        case '02':
                            moveLabel = 'Top Right';
                            break;
                        case '10':
                            moveLabel = 'Middle Left';
                            break;
                        case '11':
                            moveLabel = 'Center';
                            break;
                        case '12':
                            moveLabel = 'Middle Right';
                            break;
                        case '20':
                            moveLabel = 'Bottom Left';
                            break;
                        case '21':
                            moveLabel = 'Bottom Middle';
                            break;
                        case '22':
                            moveLabel = 'Bottom Right';
                            break;
                    }
                    // Append the move label to the move container
                    moveContainer.innerHTML += `<div class="move-label">${move.id}: ${moveLabel}</div>`;
                });
            });