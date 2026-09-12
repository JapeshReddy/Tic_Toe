import { DIFFICULTIES, MEDIUM_BLUNDER_RATE, PLAYERS } from './constants'
import { calculateWinner, getEmptySquares, isBoardFull } from './gameLogic'

function getOpponent(symbol) {
  return symbol === PLAYERS.X ? PLAYERS.O : PLAYERS.X
}

function randomMove(board) {
  const empty = getEmptySquares(board)
  if (empty.length === 0) return null
  return empty[Math.floor(Math.random() * empty.length)]
}

// Minimax over the tiny 3x3 space. aiSymbol maximizes; the opponent minimizes.
// Returns { score, index } for the player to move. Depth biases the AI toward
// faster wins / slower losses so it plays the most natural move.
function minimax(board, playerToMove, aiSymbol, depth) {
  const { winner } = calculateWinner(board)
  if (winner === aiSymbol) return { score: 10 - depth, index: null }
  if (winner === getOpponent(aiSymbol)) return { score: depth - 10, index: null }
  if (isBoardFull(board)) return { score: 0, index: null }

  const empty = getEmptySquares(board)
  const isMaximizing = playerToMove === aiSymbol
  let best = { score: isMaximizing ? -Infinity : Infinity, index: empty[0] }

  for (const index of empty) {
    const next = board.slice()
    next[index] = playerToMove
    const { score } = minimax(next, getOpponent(playerToMove), aiSymbol, depth + 1)
    if (isMaximizing ? score > best.score : score < best.score) {
      best = { score, index }
    }
  }
  return best
}

function minimaxMove(board, aiSymbol) {
  if (getEmptySquares(board).length === 0) return null
  return minimax(board, aiSymbol, aiSymbol, 0).index
}

// Picks the computer's move index for the given board, symbol, and difficulty.
// easy -> random, medium -> mostly optimal with occasional blunders,
// hard -> perfect play.
export function getComputerMove(board, aiSymbol, difficulty) {
  if (difficulty === DIFFICULTIES.EASY) {
    return randomMove(board)
  }
  if (difficulty === DIFFICULTIES.MEDIUM) {
    return Math.random() < MEDIUM_BLUNDER_RATE
      ? randomMove(board)
      : minimaxMove(board, aiSymbol)
  }
  return minimaxMove(board, aiSymbol)
}
