import { PLAYERS, WINNING_LINES } from './constants'

// Returns { winner, line } where winner is 'X' | 'O' | null and line is the
// winning index triplet (or null when there is no winner yet).
export function calculateWinner(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line }
    }
  }
  return { winner: null, line: null }
}

export function isBoardFull(board) {
  return board.every((cell) => cell !== null)
}

// A draw is a full board with no winner.
export function isDraw(board) {
  return isBoardFull(board) && calculateWinner(board).winner === null
}

export function getEmptySquares(board) {
  const empty = []
  board.forEach((cell, index) => {
    if (cell === null) empty.push(index)
  })
  return empty
}

// X always moves first, so the number of filled cells tells us whose turn it
// is: even -> X, odd -> O.
export function getCurrentPlayer(board) {
  const filled = board.filter((cell) => cell !== null).length
  return filled % 2 === 0 ? PLAYERS.X : PLAYERS.O
}
