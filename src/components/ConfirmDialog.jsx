import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function ConfirmDialog({ open, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="confirm-reset-title">
      <DialogTitle id="confirm-reset-title">Start a new game?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your current game will be lost. This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>
          New Game
        </Button>
      </DialogActions>
    </Dialog>
  )
}
