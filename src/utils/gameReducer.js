// The game's state transitions, as a plain pure function. Keeping them out of
// the hook is what makes the phase gate and the confirmation flows testable
// without a DOM: the hook owns React, this module owns the rules.
import {
  BOARD_SIZE,
  CONFIRM_INTENTS,
  DIFFICULTIES,
  GAME_MODES,
  PHASES,
  PLAYERS,
} from './constants'
import { calculateWinner, getCurrentPlayer } from './gameLogic'

export const createEmptyBoard = () => Array(BOARD_SIZE).fill(null)

export const initialState = {
  history: [createEmptyBoard()],
  currentMove: 0,
  gameMode: GAME_MODES.HOT_SEAT,
  humanSymbol: PLAYERS.X,
  difficulty: DIFFICULTIES.HARD,
  phase: PHASES.LOGIN,
  confirmOpen: false,
  // Which action the open confirmation belongs to. Meaningful only while
  // confirmOpen is true, but always left at RESET so it never goes stale.
  confirmIntent: CONFIRM_INTENTS.RESET,
  // Pending config change awaiting confirmation, or null.
  pendingConfig: null,
  snackbarOpen: false,
}

// Starts a clean game, optionally applying config overrides, and flags the
// "new game" snackbar.
function startFreshGame(state, overrides = {}) {
  return {
    ...state,
    history: [createEmptyBoard()],
    currentMove: 0,
    confirmOpen: false,
    confirmIntent: CONFIRM_INTENTS.RESET,
    pendingConfig: null,
    snackbarOpen: true,
    ...overrides,
  }
}

// Leaves the game for the login screen, discarding the board on the way. The
// phase change is its own acknowledgement, so no snackbar; and since nothing
// about being signed in is stored anywhere, signing back in starts from
// scratch either way.
function signOut(state) {
  return {
    ...startFreshGame(state),
    snackbarOpen: false,
    phase: PHASES.LOGIN,
  }
}

// Opens the shared confirmation dialog on whatever `intent` will carry out.
function requestConfirmation(state, intent, pendingConfig) {
  return {
    ...state,
    confirmOpen: true,
    confirmIntent: intent,
    pendingConfig,
  }
}

// Places the current player's mark at `index`, truncating any future history
// when playing from a past move. Returns unchanged state for invalid moves.
function applyMove(state, index) {
  const board = state.history[state.currentMove]
  const { winner } = calculateWinner(board)
  if (board[index] !== null || winner) return state

  const nextBoard = board.slice()
  nextBoard[index] = getCurrentPlayer(board)
  const history = state.history.slice(0, state.currentMove + 1)
  history.push(nextBoard)
  return { ...state, history, currentMove: history.length - 1 }
}

function isBoardDirty(state) {
  return state.history[state.currentMove].some((cell) => cell !== null)
}

export function reducer(state, action) {
  switch (action.type) {
    case 'MOVE':
      return applyMove(state, action.index)

    case 'JUMP_TO':
      return { ...state, currentMove: action.move }

    case 'REQUEST_CONFIG': {
      const change = { [action.key]: action.value }
      if (isBoardDirty(state)) {
        return requestConfirmation(state, CONFIRM_INTENTS.RESET, change)
      }
      return startFreshGame(state, change)
    }

    case 'REQUEST_RESET': {
      if (isBoardDirty(state)) {
        return requestConfirmation(state, CONFIRM_INTENTS.RESET, {})
      }
      return startFreshGame(state)
    }

    case 'SIGN_IN':
      return { ...state, phase: PHASES.GAME }

    case 'REQUEST_SIGN_OUT': {
      if (isBoardDirty(state)) {
        return requestConfirmation(state, CONFIRM_INTENTS.SIGN_OUT, {})
      }
      return signOut(state)
    }

    case 'CONFIRM':
      if (state.confirmIntent === CONFIRM_INTENTS.SIGN_OUT) {
        return signOut(state)
      }
      return startFreshGame(state, state.pendingConfig || {})

    case 'CANCEL':
      return {
        ...state,
        confirmOpen: false,
        confirmIntent: CONFIRM_INTENTS.RESET,
        pendingConfig: null,
      }

    case 'DISMISS_SNACKBAR':
      return { ...state, snackbarOpen: false }

    default:
      return state
  }
}
