import { useCallback, useEffect, useMemo, useReducer } from 'react'
import {
  BOARD_SIZE,
  COMPUTER_MOVE_DELAY,
  DIFFICULTIES,
  GAME_MODES,
  PLAYERS,
} from '../utils/constants'
import {
  calculateWinner,
  getCurrentPlayer,
  isDraw as checkDraw,
} from '../utils/gameLogic'
import { getComputerMove } from '../utils/ai'

const createEmptyBoard = () => Array(BOARD_SIZE).fill(null)

const initialState = {
  history: [createEmptyBoard()],
  currentMove: 0,
  gameMode: GAME_MODES.HOT_SEAT,
  humanSymbol: PLAYERS.X,
  difficulty: DIFFICULTIES.HARD,
  confirmOpen: false,
  snackbarOpen: false,
  // Pending config change awaiting confirmation, or null.
  pendingConfig: null,
}

// Starts a clean game, optionally applying config overrides, and flags the
// "new game" snackbar.
function startFreshGame(state, overrides = {}) {
  return {
    ...state,
    history: [createEmptyBoard()],
    currentMove: 0,
    confirmOpen: false,
    pendingConfig: null,
    snackbarOpen: true,
    ...overrides,
  }
}

// Places `player`'s mark at `index`, truncating any future history when
// playing from a past move. Returns unchanged state for invalid moves.
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

function reducer(state, action) {
  switch (action.type) {
    case 'MOVE':
      return applyMove(state, action.index)

    case 'JUMP_TO':
      return { ...state, currentMove: action.move }

    case 'REQUEST_CONFIG': {
      const change = { [action.key]: action.value }
      if (isBoardDirty(state)) {
        return { ...state, confirmOpen: true, pendingConfig: change }
      }
      return startFreshGame(state, change)
    }

    case 'REQUEST_RESET': {
      if (isBoardDirty(state)) {
        return { ...state, confirmOpen: true, pendingConfig: {} }
      }
      return startFreshGame(state)
    }

    case 'CONFIRM':
      return startFreshGame(state, state.pendingConfig || {})

    case 'CANCEL':
      return { ...state, confirmOpen: false, pendingConfig: null }

    case 'DISMISS_SNACKBAR':
      return { ...state, snackbarOpen: false }

    default:
      return state
  }
}

export function useTicTacToe() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const board = state.history[state.currentMove]
  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(board),
    [board],
  )
  const isDraw = useMemo(() => checkDraw(board), [board])
  const currentPlayer = useMemo(() => getCurrentPlayer(board), [board])
  const isGameOver = Boolean(winner) || isDraw

  const computerSymbol =
    state.humanSymbol === PLAYERS.X ? PLAYERS.O : PLAYERS.X
  const isComputerTurn =
    state.gameMode === GAME_MODES.VS_COMPUTER &&
    !isGameOver &&
    currentPlayer === computerSymbol

  // Drive the computer's move whenever it is its turn.
  useEffect(() => {
    if (!isComputerTurn) return undefined
    const timer = setTimeout(() => {
      const index = getComputerMove(board, computerSymbol, state.difficulty)
      if (index !== null) dispatch({ type: 'MOVE', index })
    }, COMPUTER_MOVE_DELAY)
    return () => clearTimeout(timer)
  }, [isComputerTurn, board, computerSymbol, state.difficulty])

  const makeMove = useCallback((index) => {
    dispatch({ type: 'MOVE', index })
  }, [])
  const jumpTo = useCallback((move) => {
    dispatch({ type: 'JUMP_TO', move })
  }, [])
  const setConfig = useCallback((key, value) => {
    dispatch({ type: 'REQUEST_CONFIG', key, value })
  }, [])
  const requestReset = useCallback(() => {
    dispatch({ type: 'REQUEST_RESET' })
  }, [])
  const confirmReset = useCallback(() => {
    dispatch({ type: 'CONFIRM' })
  }, [])
  const cancelReset = useCallback(() => {
    dispatch({ type: 'CANCEL' })
  }, [])
  const dismissSnackbar = useCallback(() => {
    dispatch({ type: 'DISMISS_SNACKBAR' })
  }, [])

  return {
    board,
    currentPlayer,
    winner,
    winningLine,
    isDraw,
    isGameOver,
    history: state.history,
    currentMove: state.currentMove,
    gameMode: state.gameMode,
    humanSymbol: state.humanSymbol,
    difficulty: state.difficulty,
    isComputerTurn,
    confirmOpen: state.confirmOpen,
    snackbarOpen: state.snackbarOpen,
    makeMove,
    jumpTo,
    setConfig,
    requestReset,
    confirmReset,
    cancelReset,
    dismissSnackbar,
  }
}
