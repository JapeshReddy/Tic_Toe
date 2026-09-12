import { describe, expect, it } from 'vitest'
import { initialState, reducer } from './gameReducer'
import {
  CONFIRM_INTENTS,
  DELIVERY_STATES,
  DIFFICULTIES,
  GAME_MODES,
  PHASES,
} from './constants'

// The rules the UI gates on: where the app is, and what each destructive
// action does to the board. Plain vitest, no DOM — the same seam the game
// logic and the AI are tested at.

const play = (state, index) => reducer(state, { type: 'MOVE', index })
const startDelivery = (state) => reducer(state, { type: 'START_DELIVERY' })
const arrive = (state) => reducer(state, { type: 'DELIVERY_ARRIVED' })
// Signing in is a Delivery: it runs, then the game replaces the login card.
const signedIn = () => arrive(startDelivery(initialState))

describe('the phase gate', () => {
  it('starts on the login screen with an untouched board', () => {
    expect(initialState.phase).toBe(PHASES.LOGIN)
    expect(initialState.history[initialState.currentMove].some(Boolean)).toBe(
      false,
    )
  })

  it('enters the game on sign in', () => {
    expect(signedIn().phase).toBe(PHASES.GAME)
  })
})

// The coarse states the login screen gates on. Anything finer — percentage, van
// position, Dot arcs — is choreography and is not modelled here (ADR-0004).
describe('the Delivery', () => {
  it('starts at rest on the login screen', () => {
    expect(initialState.delivery).toBe(DELIVERY_STATES.IDLE)
  })

  it('stays on the login screen while it is under way', () => {
    const state = startDelivery(initialState)

    expect(state.delivery).toBe(DELIVERY_STATES.DELIVERING)
    expect(state.phase).toBe(PHASES.LOGIN)
  })

  it('ignores a second press while one is under way', () => {
    const delivering = startDelivery(initialState)

    expect(startDelivery(delivering)).toBe(delivering)
  })

  it('shows the game once it has arrived', () => {
    const state = arrive(startDelivery(initialState))

    expect(state.delivery).toBe(DELIVERY_STATES.ARRIVED)
    expect(state.phase).toBe(PHASES.GAME)
  })

  it('ignores an arrival with no Delivery under way', () => {
    const state = arrive(initialState)

    expect(state).toBe(initialState)
    expect(state.phase).toBe(PHASES.LOGIN)
  })
})

describe('signing out', () => {
  it('leaves an untouched game immediately, with no confirmation', () => {
    const state = reducer(signedIn(), { type: 'REQUEST_SIGN_OUT' })

    expect(state.phase).toBe(PHASES.LOGIN)
    expect(state.confirmOpen).toBe(false)
    expect(state.snackbarOpen).toBe(false)
    expect(state.delivery).toBe(DELIVERY_STATES.IDLE)
  })

  it('asks first when the board has a move on it', () => {
    const dirty = play(signedIn(), 4)
    const state = reducer(dirty, { type: 'REQUEST_SIGN_OUT' })

    expect(state.confirmOpen).toBe(true)
    expect(state.confirmIntent).toBe(CONFIRM_INTENTS.SIGN_OUT)
    expect(state.phase).toBe(PHASES.GAME)
  })

  it('keeps the game intact when the confirmation is cancelled', () => {
    const dirty = play(signedIn(), 4)
    const asked = reducer(dirty, { type: 'REQUEST_SIGN_OUT' })
    const state = reducer(asked, { type: 'CANCEL' })

    expect(state.confirmOpen).toBe(false)
    expect(state.phase).toBe(PHASES.GAME)
    expect(state.history[state.currentMove][4]).toBe('X')
  })

  it('resets the board on the way out, so signing back in is a fresh game', () => {
    const dirty = play(signedIn(), 4)
    const asked = reducer(dirty, { type: 'REQUEST_SIGN_OUT' })
    const out = reducer(asked, { type: 'CONFIRM' })

    expect(out.phase).toBe(PHASES.LOGIN)
    expect(out.history[out.currentMove].some(Boolean)).toBe(false)
    // The phase change is its own acknowledgement, so no "new game" toast.
    expect(out.snackbarOpen).toBe(false)
    // Nothing about the finished Delivery carries over, so the next sign-in
    // plays the whole thing again (ADR-0002).
    expect(out.delivery).toBe(DELIVERY_STATES.IDLE)
    expect(signedIn().history[0].some(Boolean)).toBe(false)
  })

  it('keeps the chosen configuration, so only the board is lost', () => {
    const configured = reducer(initialState, {
      type: 'REQUEST_CONFIG',
      key: 'gameMode',
      value: GAME_MODES.VS_COMPUTER,
    })
    const out = reducer(play(configured, 4), { type: 'REQUEST_SIGN_OUT' })

    expect(out.gameMode).toBe(GAME_MODES.VS_COMPUTER)
  })
})

describe('the reset confirmation', () => {
  // Unchanged by the sign-out work, but pinned here: both flows share one
  // dialog, so a change to either must not quietly take the other with it.
  it('asks before resetting a game in progress, then resets on confirm', () => {
    const dirty = play(signedIn(), 0)
    const asked = reducer(dirty, { type: 'REQUEST_RESET' })

    expect(asked.confirmOpen).toBe(true)
    expect(asked.confirmIntent).toBe(CONFIRM_INTENTS.RESET)
    expect(asked.phase).toBe(PHASES.GAME)

    const reset = reducer(asked, { type: 'CONFIRM' })
    expect(reset.history[reset.currentMove].some(Boolean)).toBe(false)
    expect(reset.snackbarOpen).toBe(true)
    expect(reset.phase).toBe(PHASES.GAME)
  })

  it('resets an untouched game immediately, with no dialog', () => {
    const state = reducer(signedIn(), { type: 'REQUEST_RESET' })

    expect(state.confirmOpen).toBe(false)
    expect(state.snackbarOpen).toBe(true)
  })

  it('defers a config change until the board is discarded', () => {
    const dirty = play(signedIn(), 0)
    const asked = reducer(dirty, {
      type: 'REQUEST_CONFIG',
      key: 'difficulty',
      value: DIFFICULTIES.EASY,
    })

    expect(asked.confirmOpen).toBe(true)
    expect(asked.difficulty).toBe(DIFFICULTIES.HARD)

    const applied = reducer(asked, { type: 'CONFIRM' })
    expect(applied.difficulty).toBe(DIFFICULTIES.EASY)
    expect(applied.history[applied.currentMove].some(Boolean)).toBe(false)
  })

  it('applies a config change straight away on a clean board', () => {
    const state = reducer(signedIn(), {
      type: 'REQUEST_CONFIG',
      key: 'difficulty',
      value: DIFFICULTIES.EASY,
    })

    expect(state.difficulty).toBe(DIFFICULTIES.EASY)
    expect(state.confirmOpen).toBe(false)
  })
})

describe('moves', () => {
  it('ignores a move on a filled cell', () => {
    const played = play(signedIn(), 4)
    const again = play(played, 4)

    expect(again.history).toHaveLength(played.history.length)
  })

  it('truncates the future when playing from a past move', () => {
    const three = play(play(play(signedIn(), 0), 1), 2)
    const back = reducer(three, { type: 'JUMP_TO', move: 1 })
    const replay = play(back, 3)

    expect(replay.history).toHaveLength(3)
  })
})
