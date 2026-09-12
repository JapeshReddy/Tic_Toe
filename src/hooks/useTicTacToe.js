import { useCallback, useEffect, useMemo, useReducer } from 'react'
import {
  COMPUTER_MOVE_DELAY,
  GAME_MODES,
  PHASES,
  PLAYERS,
} from '../utils/constants'
import {
  calculateWinner,
  getCurrentPlayer,
  isDraw as checkDraw,
} from '../utils/gameLogic'
import { getComputerMove } from '../utils/ai'
import { initialState, reducer } from '../utils/gameReducer'

// Owns the game's React state; the rules themselves live in gameReducer.
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

  const isSignedIn = state.phase === PHASES.GAME

  const computerSymbol =
    state.humanSymbol === PLAYERS.X ? PLAYERS.O : PLAYERS.X
  // Gated on the phase as well: with no game on screen there is nothing for the
  // computer to play, and a move made behind the login screen would be waiting
  // on the board at the next sign-in.
  const isComputerTurn =
    isSignedIn &&
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
  // Signing in is a Delivery: pressing the button starts it, and it hands over
  // to the game when it arrives. How long the middle takes is the login
  // screen's business, not the game's.
  const startDelivery = useCallback(() => {
    dispatch({ type: 'START_DELIVERY' })
  }, [])
  const arriveDelivery = useCallback(() => {
    dispatch({ type: 'DELIVERY_ARRIVED' })
  }, [])
  const requestSignOut = useCallback(() => {
    dispatch({ type: 'REQUEST_SIGN_OUT' })
  }, [])
  const confirmPending = useCallback(() => {
    dispatch({ type: 'CONFIRM' })
  }, [])
  const cancelPending = useCallback(() => {
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
    isSignedIn,
    delivery: state.delivery,
    confirmOpen: state.confirmOpen,
    confirmIntent: state.confirmIntent,
    snackbarOpen: state.snackbarOpen,
    makeMove,
    jumpTo,
    setConfig,
    requestReset,
    startDelivery,
    arriveDelivery,
    requestSignOut,
    confirmPending,
    cancelPending,
    dismissSnackbar,
  }
}
