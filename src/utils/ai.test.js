import { describe, expect, it } from 'vitest'
import { getComputerMove } from './ai'
import { DIFFICULTIES, PLAYERS } from './constants'
import {
  calculateWinner,
  getCurrentPlayer,
  getEmptySquares,
  isBoardFull,
} from './gameLogic'

function board(spec) {
  return spec.split('').map((c) => (c === '.' ? null : c))
}

const EMPTY = board('.........')

describe('getComputerMove — shared guarantees', () => {
  const all = Object.values(DIFFICULTIES)

  it.each(all)('%s always returns a legal empty square', (difficulty) => {
    const cells = board('X.O.X.O..')
    const open = getEmptySquares(cells)
    // Repeat because easy/medium are stochastic.
    for (let i = 0; i < 50; i += 1) {
      expect(open).toContain(getComputerMove(cells, PLAYERS.O, difficulty))
    }
  })

  it.each(all)('%s returns null on a full board', (difficulty) => {
    expect(getComputerMove(board('XXOOOXXOX'), PLAYERS.O, difficulty)).toBeNull()
  })
})

describe('hard difficulty', () => {
  const hardMove = (cells, symbol) =>
    getComputerMove(cells, symbol, DIFFICULTIES.HARD)

  it('takes an immediate win over any other move', () => {
    // O holds 0 and 1; 2 completes the top row.
    expect(hardMove(board('OO.X.XX..'), PLAYERS.O)).toBe(2)
  })

  it('blocks the opponent rather than playing elsewhere', () => {
    // X threatens 0,1,2 — O must take 2.
    expect(hardMove(board('XX..O....'), PLAYERS.O)).toBe(2)
  })

  it('prefers winning now over blocking', () => {
    // Both sides have a threat; O completes its own line first.
    expect(hardMove(board('OO.XX....'), PLAYERS.O)).toBe(2)
  })

  // The headline property: perfect play can never lose. We exhaustively play
  // the AI against every possible sequence of opponent moves.
  it('is unbeatable as O against every possible X line of play', () => {
    const seen = new Set()

    function playOut(cells) {
      const key = cells.join('')
      if (seen.has(key)) return
      seen.add(key)

      const { winner } = calculateWinner(cells)
      expect(winner).not.toBe(PLAYERS.X)
      if (winner || isBoardFull(cells)) return

      if (getCurrentPlayer(cells) === PLAYERS.O) {
        const next = cells.slice()
        next[hardMove(cells, PLAYERS.O)] = PLAYERS.O
        playOut(next)
        return
      }

      // X (the human) tries every legal move.
      for (const index of getEmptySquares(cells)) {
        const next = cells.slice()
        next[index] = PLAYERS.X
        playOut(next)
      }
    }

    playOut(EMPTY)
  })
})

describe('easy difficulty', () => {
  it('ignores an available win (it plays at random)', () => {
    // Over many trials a random player will miss the winning square at 2.
    const cells = board('OO.X.XX..')
    const picks = new Set()
    for (let i = 0; i < 200; i += 1) {
      picks.add(getComputerMove(cells, PLAYERS.O, DIFFICULTIES.EASY))
    }
    expect(picks.size).toBeGreaterThan(1)
  })
})

describe('medium difficulty', () => {
  it('usually finds the winning move but not always', () => {
    const cells = board('OO.X.XX..')
    let optimal = 0
    const trials = 400
    for (let i = 0; i < trials; i += 1) {
      if (getComputerMove(cells, PLAYERS.O, DIFFICULTIES.MEDIUM) === 2) {
        optimal += 1
      }
    }
    // Blunder rate is 30%, so expect roughly 70% optimal play plus the
    // chance a random blunder lands on the winning square anyway. Wide
    // bounds keep this from flaking.
    expect(optimal).toBeGreaterThan(trials * 0.5)
    expect(optimal).toBeLessThan(trials)
  })
})
