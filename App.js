const board = document.getElementById('board');
const boardSize = 8;

let gameState = [];
let currentPlayer = 'black';
let validMoves = [];

function initializeGame() {
    gameState = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    gameState[3][3] = 'white';
    gameState[3][4] = 'black';
    gameState[4][3] = 'black';
    gameState[4][4] = 'white';

    validMoves = getValidMoves(gameState, currentPlayer);

    renderBoard();
}

function renderBoard() {
  board.innerHTML = '';
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = i;
      cell.dataset.col = j;

      if (gameState[i][j] === 'white') {
        cell.classList.add('white');
      } else if (gameState[i][j] === 'black') {
        cell.classList.add('black');
      }

      const isCurrentPlayer = currentPlayer === 'black' ? 'black' : 'white';
      const isValidMove = validMoves.some(move => move.row === i && move.col === j);
      const isOpponentPiece = currentPlayer === 'black' ? 'white' : 'black';

      if (isValidMove && gameState[i][j] === null) {
        cell.classList.add('valid-move');
        cell.addEventListener('click', handleMove);
      } else if (gameState[i][j] === isCurrentPlayer) {
        cell.addEventListener('click', handleMove);
      } else if (gameState[i][j] === isOpponentPiece) {
        cell.classList.add('opponent-piece');
      } else {
        cell.classList.add('invalid-move');
      }

      board.appendChild(cell);
    }
  }
}

function handleMove(event) {
const row = parseInt(event.target.dataset.row);
const col = parseInt(event.target.dataset.col);

// Check if the selected cell is a valid move
const validMove = validMoves.find(move => move.row === row && move.col === col);
if (!validMove) {
// If there are no valid moves left, switch player
if (validMoves.length === 0) {
switchPlayer();
validMoves = getValidMoves(gameState, currentPlayer);
// If the other player also has no valid moves left, end the game
if (validMoves.length === 0) {
endGame();
}
}
return;
}

// Place the piece and capture opponent's pieces
placePiece(row, col);

// Switch to the other player and get the new set of valid moves
switchPlayer();
validMoves = getValidMoves(gameState, currentPlayer);

// If there are no valid moves left, switch back to the original player and get the new set of valid moves
if (validMoves.length === 0) {
switchPlayer();
validMoves = getValidMoves(gameState, currentPlayer);
// If there are no valid moves left for both players, end the game
if (validMoves.length === 0) {
endGame();
}
}

// Render the updated board
renderBoard();
}


  function currentRoundOver() {
    const whiteMoves = getValidMoves(gameState, 'white');
    const blackMoves = getValidMoves(gameState, 'black');
    
    return whiteMoves.length === 0 && blackMoves.length === 0;
    }
    
    function endRound() {
    // ゲーム終了時と同様に、各プレイヤーの石の数を数え、勝者を決定する
    let blackScore = 0;
    let whiteScore = 0;
    
    for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
    if (gameState[i][j] === 'black') {
    blackScore++;
    } else if (gameState[i][j] === 'white') {
    whiteScore++;
    }
    }
    }
    
    let message;
    
    if (blackScore > whiteScore) {
    message = '黒の勝利です！';
    } else if (whiteScore > blackScore) {
    message = '白の勝利です！';
    } else {
    message = '引き分けです！';
    }
    
    alert('ラウンドが終了しました\n${message}');
    
    // ゲームの状態を初期化し、新しいラウンドを開始する
    initializeGame();
    }
    
    function startNewTurn() {
    validMoves = getValidMoves(gameState, currentPlayer);
    renderBoard();
    }
  

function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

const passButton = document.getElementById('pass-button');
passButton.addEventListener('click', () => {
  switchPlayer();
  
  // Check if the round has ended
  if (currentRoundOver()) {
    endRound();
  } else {
    startNewTurn();
  }
});
  


function endGame() {
    let blackScore = 0;
    let whiteScore = 0;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (gameState[i][j] === 'black') {
                blackScore++;
            } else if (gameState[i][j] === 'white') {
                whiteScore++;
            }
        }
    }

    let message;

    if (blackScore > whiteScore) {
        message = '黒の勝利です！';
    } else if (whiteScore > blackScore) {
        message = '白の勝利です！';
    } else {
        message = '引き分けです！';
    }

    alert(`ゲームが終了しました\n${message}`);
}




function placePiece(row, col) {
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize || gameState[row][col] !== null) {
        return;
    }

    gameState[row][col] = currentPlayer;

    const capturedPieces = getCapturedPieces(gameState, currentPlayer, row, col);

    capturedPieces.forEach((piece) => {
        gameState[piece.row][piece.col] = currentPlayer;
    });
}


  function getAdjacentCells(state, row, col) {
    const adjacentCells = [];

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) {
                continue;
            }
    
            const r = row + dr;
            const c = col + dc;
    
            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && state[r][c] !== null) {
                adjacentCells.push({ row: r, col: c });
            }
        }
    }
    
    return adjacentCells;
    
}

function getValidMoves(state, player) {
    const opponent = player === 'black' ? 'white' : 'black';
    const validMoves = [];
  
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (state[row][col] !== null) {
          continue;
        }
        // Check if placing a piece at this position will capture any opponent pieces
        if (checkCapture(state, player, row, col)) {
          validMoves.push({row, col});
        }
      }
    }
  
    return validMoves;
  }
  
  function checkCapture(state, player, row, col) {
    const opponent = player === 'black' ? 'white' : 'black';
  
    // Check each direction for pieces that can be captured
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) {
          continue;
        }
  
        let r = row + dr;
        let c = col + dc;
        let count = 0;
  
        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && state[r][c] === opponent) {
          r += dr;
          c += dc;
          count++;
        }
  
        if (count > 0 && r >= 0 && r < boardSize && c >= 0 && c < boardSize && state[r][c] === player) {
          return true;
        }
      }
    }
  
    return false;
  }
  


function getCapturedPieces(state, player, row, col, targetRow, targetCol) {
const capturedPieces = [];
const opponent = player === 'black' ? 'white' : 'black';

for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) {
            continue;
        }

        const r = targetRow + dr;
        const c = targetCol + dc;
        let piecesToCapture = [];

        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
            if (state[r][c] === null) {
                break;
            }

            if (state[r][c] === player) {
                capturedPieces.push(...piecesToCapture);
                break;
            }

            if (state[r][c] === opponent) {
                piecesToCapture.push({ row: r, col: c });
            }

            r += dr;
            c += dc;
        }
    }
}

return capturedPieces;
}


function switchPlayer() {
currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

function endGame() {
alert('Game over!');
}

function getValidMoves(boardState, player) {
    const validMoves = [];
    
    // Check each cell on the board for valid moves
    for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
    if (boardState[row][col] !== null) {
    continue;
    }

    const directions = [
        { row: -1, col: 0 },   // Up
        { row: 1, col: 0 },    // Down
        { row: 0, col: -1 },   // Left
        { row: 0, col: 1 },    // Right
        { row: -1, col: -1 },  // Up-Left
        { row: -1, col: 1 },   // Up-Right
        { row: 1, col: -1 },   // Down-Left
        { row: 1, col: 1 },    // Down-Right
      ];
    
      let validMove = false;
    
      // Check each direction for valid moves
      for (const direction of directions) {
        let r = row + direction.row;
        let c = col + direction.col;
    
        let capturedPieces = [];
    
        // Move in the direction until the end of the board or an empty cell is reached
        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && boardState[r][c] !== null) {
          if (boardState[r][c] === player) {
            if (capturedPieces.length > 0) {
              validMove = true;
              break;
            } else {
              break;
            }
          } else {
            capturedPieces.push({ row: r, col: c });
          }
    
          r += direction.row;
          c += direction.col;
        }
    
        if (validMove) {
          break;
        }
      }
    
      if (validMove) {
        validMoves.push({ row: row, col: col });
      }
    }

}

return validMoves;
}

  
  function isValidMove(state, player, opponent, row, col) {
    // Check if the current cell is adjacent to an opponent's piece
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
  
        const r = row + i;
        const c = col + j;
  
        if (r < 0 || r >= boardSize || c < 0 || c >= boardSize || state[r][c] !== opponent) {
          continue;
        }
  
        // Check if the current cell is part of a line of opponent's pieces that can be captured
        if (isCapturingLine(state, player, opponent, row, col, i, j)) {
          return true;
        }
      }
    }
  
    return false;
  }
  
  function isCapturingLine(state, player, opponent, row, col, dr, dc) {
    let r = row + dr;
    let c = col + dc;
  
    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && state[r][c] === opponent) {
      r += dr;
      c += dc;
    }
  
    if (r < 0 || r >= boardSize || c < 0 || c >= boardSize || state[r][c] !== player) {
      return false;
    }
  
    r = row + dr;
    c = col + dc;
  
    while (r !== row || c !== col) {
      state[r][c] = player;
      r += dr;
      c += dc;
    }
  
    return true;
  }
  

function getCapturedPieces(state, player, row, col) {
    const capturedPieces = [];
  
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) {
          continue;
        }
  
        let r = row + dr;
        let c = col + dc;
        let piecesToCapture = [];
  
        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
          if (state[r][c] === null) {
            break;
          }
  
          if (state[r][c] === player) {
            capturedPieces.push(...piecesToCapture);
            break;
          }
  
          piecesToCapture.push({ row: r, col: c });
  
          r += dr;
          c += dc;
        }
      }
    }
    
    return capturedPieces;
  }
  

initializeGame();


