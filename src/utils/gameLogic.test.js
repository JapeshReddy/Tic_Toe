import { describe, expect, it } from 'vitest'
import {
  calculateWinner,
  getCurrentPlayer,
  getEmptySquares,
  isBoardFull,
  isDraw,
} from './gameLogic'
import { WINNING_LINES } from './constants'

// Builds a board from a 9-char string: 'X', 'O', or '.' for empty.
function board(spec) {
  return spec.split('').map((c) => (c === '.' ? null : c))
}

const EMPTY = board('.........')

describe('calculateWinner', () => {
  it('reports no winner on an empty board', () => {
    expect(calculateWinner(EMPTY)).toEqual({ winner: null, line: null })
  })

  it('detects a winner on every winning line', () => {
    for (const line of WINNING_LINES) {
      const cells = EMPTY.slice()
      for (const index of line) cells[index] = 'X'
      expect(calculateWinner(cells)).toEqual({ winner: 'X', line })
    }
  })

  it('returns the winning line alongside the winner', () => {
    expect(calculateWinner(board('XXXOO....'))).toEqual({
      winner: 'X',
      line: [0, 1, 2],
    })
  })

  it('does not treat a full non-winning board as a win', () => {
    expect(calculateWinner(board('XXOOOXXOX')).winner).toBeNull()
  })
})

describe('isBoardFull', () => {
  it('is false while any cell is empty', () => {
    expect(isBoardFull(board('XXOOOXXO.'))).toBe(false)
  })

  it('is true once every cell is filled', () => {
    expect(isBoardFull(board('XXOOOXXOX'))).toBe(true)
  })
})

describe('isDraw', () => {
  it('is true for a full board with no winner', () => {
    expect(isDraw(board('XXOOOXXOX'))).toBe(true)
  })

  it('is false for a full board that has a winner', () => {
    expect(isDraw(board('XXXOOXOXO'))).toBe(false)
  })

  it('is false for an unfinished board', () => {
    expect(isDraw(EMPTY)).toBe(false)
  })
})

describe('getEmptySquares', () => {
  it('lists every index on an empty board', () => {
    expect(getEmptySquares(EMPTY)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('lists only the open indices', () => {
    expect(getEmptySquares(board('X.O.X.O.X'))).toEqual([1, 3, 5, 7])
  })

  it('is empty on a full board', () => {
    expect(getEmptySquares(board('XXOOOXXOX'))).toEqual([])
  })
})

describe('getCurrentPlayer', () => {
  it('starts with X', () => {
    expect(getCurrentPlayer(EMPTY)).toBe('X')
  })

  it('gives O the turn after an odd number of moves', () => {
    expect(getCurrentPlayer(board('X........'))).toBe('O')
  })

  it('returns to X after an even number of moves', () => {
    expect(getCurrentPlayer(board('XO.......'))).toBe('X')
  })
})
