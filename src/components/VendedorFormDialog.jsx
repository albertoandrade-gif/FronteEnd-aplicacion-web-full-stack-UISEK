import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import api from "../services/api";

const TIPOS_VENDEDOR = [
  { value: "DIGITAL", label: "Digital" },
  { value: "MULTICINES", label: "Multicines" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "NETFLIX", label: "Netflix" },
  { value: "AMAZON", label: "Amazon Prime Video" },
  { value: "DISNEY", label: "Disney+" },
  { value: "FISICO", label: "Físico" },
];
const FORMULARIO_INICIAL = {
  nombre: "",
  tipo: "DIGITAL",
};
function VendedorFormDialog({
  open,
  vendedor,
  onClose,
  onSaved,
}) {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const esEdicion = Boolean(vendedor);
  useEffect(() => {
    if (!open) {
      return;
    }
    if (vendedor) {
      setFormulario({
        nombre: vendedor.nombre ?? "",
        tipo: vendedor.tipo ?? "DIGITAL",
      });
    } else {
      setFormulario(FORMULARIO_INICIAL);
    }
    setError("");
  }, [open, vendedor]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formulario.nombre.trim() || !formulario.tipo) {
      setError("Completa todos los campos.");
      return;
    }
    const datos = {
      nombre: formulario.nombre.trim(),
      tipo: formulario.tipo,
    };
    try {
      setGuardando(true);
      setError("");
      if (esEdicion) {
        await api.patch(`/vendedores/${vendedor.id}/`, datos);
      } else {
        await api.post("/vendedores/", datos);
      }
      onSaved();
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      const datosError = errorSolicitud.response?.data;
      setError(
        datosError
          ? `No se pudo guardar: ${JSON.stringify(datosError)}`
          : "No se pudo conectar con el backend."
      );
    } finally {
      setGuardando(false);
    }
  };
  const handleClose = () => {
    if (!guardando) {
      onClose();
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {esEdicion ? "Editar vendedor" : "Nuevo vendedor"}
      </DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="formulario-vendedor"
          spacing={3}
          sx={{ pt: 1 }}
          onSubmit={handleSubmit}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Tipo"
            name="tipo"
            value={formulario.tipo}
            onChange={handleChange}
            select
            required
            fullWidth
          >
            {TIPOS_VENDEDOR.map((tipo) => (
              <MenuItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="formulario-vendedor"
          variant="contained"
          disabled={guardando}
        >
          {guardando
            ? "Guardando..."
            : esEdicion
              ? "Guardar cambios"
              : "Guardar vendedor"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default VendedorFormDialog;