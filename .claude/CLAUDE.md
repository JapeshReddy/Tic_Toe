# CLAUDE.md

## Project Overview

This project is a modern Tic-Tac-Toe web application built using React and Material UI.

The primary goals are:

* Clean and maintainable code
* Reusable components
* Modern React best practices
* Responsive UI
* Excellent user experience

---

# Design Decisions (Resolved)

These are the agreed product/architecture decisions for this app. They are
concrete and take precedence over generic guidance where they overlap.

## Gameplay

* **Game modes:** Both **hot-seat** (two humans, one device) and **vs-computer**.
* **AI difficulty (user-selectable):** three tiers.
  * `easy` — random empty square.
  * `medium` — plays a random move `MEDIUM_BLUNDER_RATE` (default 30%) of the
    time, otherwise minimax.
  * `hard` — full minimax (unbeatable; draws or wins).
* **Symbol selection:** the human picks X or O. **X always moves first**
  (convention). If the human picks O in vs-computer mode, the computer is X and
  makes the opening move.
* **Winner/draw handling:** `calculateWinner()` returns `{ winner, line }`;
  detect draw when the board is full with no winner. Never allow moves after
  game over or on filled cells.

## Configuration flow

* Config (mode / symbol / difficulty) uses **inline controls**, always visible.
* Changing any config **resets the game**.
* **Reset UX (conditional):** if the board is dirty (`board.some(Boolean)`),
  show a confirmation `Dialog` first ("Start new game? Current game will be
  lost."). After confirming (or if the board is empty), reset and show a
  `Snackbar`. No load-time or per-reset toast beyond this.

## Move history / time-travel

* **Full move history with time-travel** (snapshot per move + `currentMove`
  pointer). Jumping truncates the future.
* **Hot-seat only** — history/time-travel UI is hidden in vs-computer mode to
  avoid taking moves back against the AI.

## State architecture

* All game state lives in a single **`useTicTacToe`** hook backed by
  **`useReducer`** (chosen specifically because time-travel makes a reducer
  cleaner than scattered `useState`).
* Reducer state is a **plain, serializable object**
  (`history`, `currentMove`, `gameMode`, `humanSymbol`, `difficulty`,
  `confirmOpen`, `snackbarOpen`). Derived values (`board`, `currentPlayer`,
  `winner`, `winningLine`, `isDraw`, `isGameOver`) are computed with `useMemo`,
  not stored.
* **Pure logic lives in `utils/`** (win detection, minimax, draw detection); the
  hook orchestrates and calls them. Components stay presentational.
* The **computer move** is triggered by a `useEffect` in the hook when it is the
  computer's turn and the game is not over.

## Persistence

* **Theme only** is persisted (localStorage). The game is intentionally NOT
  persisted across reloads, but reducer state is kept serializable in case that
  changes later.

## Theming

* Light + dark via `ThemeToggle`. `useThemeMode` reads `localStorage` first,
  falls back to `prefers-color-scheme`, and persists changes.

## UI / layout

* **Win/draw is shown in the `StatusBar`** plus the winning line is highlighted
  on the board. The board **locks** after game over. No end-game modal.
* **`Square` is an MUI `Button`** — native keyboard activation and focus ring;
  dynamic `aria-label` (position + contents); disabled when the cell is filled,
  the game is over, or it is the computer's turn. Winning cells get a highlight
  `sx` variant.
* **Board uses MUI `Grid`** (three `size={4}` items per row) inside a wrapper of
  `width: min(90vw, 400px)`. Each `Square` keeps `aspectRatio: '1 / 1'` so cells
  stay square as the board scales.

---

# Technology Stack

Frontend

* React (latest stable)
* Material UI (MUI)
* JavaScript (ES6+)
* Vite

---

# Development Principles

* Keep the application simple.
* Prioritize readability over clever code.
* Avoid unnecessary abstractions.
* Follow SOLID principles where appropriate.
* Write modular, reusable components.
* Avoid code duplication.

---

# Component Guidelines

* Use only functional components.
* Use React Hooks.
* Keep each component focused on a single responsibility.
* Prefer composition over large components.
* Extract repeated UI into reusable components.

Example components:

* Board
* Square
* Header
* StatusBar
* GameControls
* ThemeToggle

---

# State Management

Use React built-in state.

Prefer:

* useState
* useMemo
* useCallback (only when beneficial)

Avoid unnecessary global state.

---

# Styling

Use Material UI components whenever possible.

Preferred components:

* Box
* Grid
* Stack
* Card
* Paper
* Typography
* Button
* IconButton
* Dialog
* Snackbar

Avoid custom CSS unless necessary.

Prefer:

* sx prop
* Theme customization

---

# Folder Structure

src/
components/
hooks/
utils/
assets/

---

# Code Style

* Use descriptive variable names.
* Prefer early returns.
* Keep functions small.
* Keep files focused.
* Remove unused imports.
* Avoid magic numbers.

---

# Naming Conventions

Components:
PascalCase

Examples:
Board
Square
GameStatus

Variables:
camelCase

Constants:
UPPER_SNAKE_CASE

---

# Error Handling

Handle:

* Invalid moves
* Game reset
* Draw detection
* Winner detection

Never allow invalid board states.

---

# UI Requirements

The application should:

* Be responsive
* Support desktop and mobile
* Have consistent spacing
* Use Material Design principles
* Provide smooth interactions
* Highlight the winning combination
* Display current player's turn
* Display winner or draw message

---

# Accessibility

* Keyboard accessible
* Proper button labels
* Sufficient color contrast
* Focus indicators

---

# Performance

* Avoid unnecessary re-renders.
* Keep renders lightweight.
* Memoize only when there is a measurable benefit.

---

# Testing Mindset

Generated code should be easy to test.

Separate:

* UI
* Game logic
* Utility functions

---

# Before Generating Code

Always:

* Reuse existing components.
* Keep code clean.
* Follow the project structure.
* Maintain consistency.
* Prefer readability over complexity.
