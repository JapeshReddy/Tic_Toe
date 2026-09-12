// Number of cells on a 3x3 board.
export const BOARD_SIZE = 9

export const PLAYERS = {
  X: 'X',
  O: 'O',
}

export const GAME_MODES = {
  HOT_SEAT: 'hotseat',
  VS_COMPUTER: 'vs-computer',
}

export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
}

// Chance the medium AI plays a random move instead of the optimal one.
export const MEDIUM_BLUNDER_RATE = 0.3

// Delay before the computer plays, so its move feels deliberate (ms).
export const COMPUTER_MOVE_DELAY = 500

// All winning index triplets on a 3x3 board.
export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]
