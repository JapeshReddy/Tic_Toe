import { useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { MotionConfig } from "motion/react";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import { buildTheme } from "./theme";
import { useThemeMode } from "./hooks/useThemeMode";
import { useTicTacToe } from "./hooks/useTicTacToe";
import { CONFIRM_INTENTS } from "./utils/constants";
import Header from "./components/Header";
import GameSetup from "./components/GameSetup";
import StatusBar from "./components/StatusBar";
import Board from "./components/Board";
import GameControls from "./components/GameControls";
import ConfirmDialog from "./components/ConfirmDialog";
import LoginScreen from "./components/LoginScreen";

// One dialog serves every destructive action, so each brings its own copy.
const CONFIRM_COPY = {
  [CONFIRM_INTENTS.RESET]: {
    title: "Start a new game?",
    message: "Your current game will be lost. This cannot be undone.",
    confirmLabel: "New Game",
  },
  [CONFIRM_INTENTS.SIGN_OUT]: {
    title: "Sign out?",
    message: "Your current game will be lost.",
    confirmLabel: "Sign Out",
  },
};

export default function App() {
  const { mode, toggleMode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const game = useTicTacToe();

  return (
    <ThemeProvider theme={theme}>
      {/* reducedMotion="user" makes every Motion animation in the tree honour
          prefers-reduced-motion, so individual components don't each have to. */}
      <MotionConfig reducedMotion="user">
        <CssBaseline />
        <Header
          mode={mode}
          onToggleTheme={toggleMode}
          showSignOut={game.isSignedIn}
          onSignOut={game.requestSignOut}
        />

        <Container maxWidth="sm" sx={{ py: 4 }}>
          {game.isSignedIn ? (
            <Stack spacing={3} alignItems="center">
              <GameSetup
                gameMode={game.gameMode}
                humanSymbol={game.humanSymbol}
                difficulty={game.difficulty}
                onChange={game.setConfig}
              />
              <StatusBar
                winner={game.winner}
                isDraw={game.isDraw}
                currentPlayer={game.currentPlayer}
                isComputerTurn={game.isComputerTurn}
              />
              <Board
                board={game.board}
                winningLine={game.winningLine}
                onSquareClick={game.makeMove}
                disabled={game.isGameOver}
                isComputerTurn={game.isComputerTurn}
              />
              <GameControls
                gameMode={game.gameMode}
                history={game.history}
                currentMove={game.currentMove}
                onReset={game.requestReset}
                onJumpTo={game.jumpTo}
              />
            </Stack>
          ) : (
            <LoginScreen onSignIn={game.signIn} />
          )}
        </Container>

        <ConfirmDialog
          open={game.confirmOpen}
          {...CONFIRM_COPY[game.confirmIntent]}
          onConfirm={game.confirmPending}
          onCancel={game.cancelPending}
        />

        <Snackbar
          open={game.snackbarOpen}
          autoHideDuration={2500}
          onClose={game.dismissSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={game.dismissSnackbar}
            severity="info"
            variant="filled"
            sx={{ width: "100%" }}
          >
            New game started
          </Alert>
        </Snackbar>
      </MotionConfig>
    </ThemeProvider>
  );
}
