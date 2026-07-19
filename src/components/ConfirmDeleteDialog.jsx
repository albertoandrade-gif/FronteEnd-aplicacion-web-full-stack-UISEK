import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function ConfirmDeleteDialog({
  open,
  nombre,
  eliminando,
  onCancel,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Eliminar película</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Seguro que deseas eliminar la película{" "}
          <strong>{nombre}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={eliminando}>
          Cancelar
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={eliminando}
        >
          {eliminando ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ConfirmDeleteDialog;