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

// Where the app is: on the login screen, or in the game. There is no router —
// the game is deliberately not addressable, so a URL can never bypass the
// login screen.
export const PHASES = {
  LOGIN: 'login',
  GAME: 'game',
}

// What the shared confirmation dialog will carry out if it is confirmed.
export const CONFIRM_INTENTS = {
  RESET: 'reset',
  SIGN_OUT: 'signOut',
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
