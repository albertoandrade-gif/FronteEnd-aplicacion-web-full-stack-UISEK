import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import api from "../services/api";

const FORMULARIO_INICIAL = {
  nombre: "",
  fecha_nacimiento: "",
  premios_ganados: 0,
  biografia: "",
};

function DirectorFormDialog({
  open,
  director,
  onClose,
  onSaved,
}) {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const esEdicion = Boolean(director);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (director) {
      setFormulario({
        nombre: director.nombre ?? "",
        fecha_nacimiento: director.fecha_nacimiento ?? "",
        premios_ganados: director.premios_ganados ?? 0,
        biografia: director.biografia ?? "",
      });
    } else {
      setFormulario(FORMULARIO_INICIAL);
    }
    setError("");
  }, [open, director]);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formulario.nombre.trim() || !formulario.fecha_nacimiento) {
      setError("Completa los campos obligatorios.");
      return;
    }
    const datos = {
      nombre: formulario.nombre.trim(),
      fecha_nacimiento: formulario.fecha_nacimiento,
      premios_ganados: Number(formulario.premios_ganados),
      biografia: formulario.biografia.trim(),
    };
    try {
      setGuardando(true);
      setError("");
      if (esEdicion) {
        await api.patch(`/directores/${director.id}/`, datos);
      } else {
        await api.post("/directores/", datos);
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
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {esEdicion ? "Editar director" : "Nuevo director"}
      </DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="formulario-director"
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
            label="Fecha de nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={formulario.fecha_nacimiento}
            onChange={handleChange}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            required
            fullWidth
          />
          <TextField
            label="Premios ganados"
            name="premios_ganados"
            type="number"
            value={formulario.premios_ganados}
            onChange={handleChange}
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            fullWidth
          />
          <TextField
            label="Biografía"
            name="biografia"
            value={formulario.biografia}
            onChange={handleChange}
            multiline
            minRows={4}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="formulario-director"
          variant="contained"
          disabled={guardando}
        >
          {guardando
            ? "Guardando..."
            : esEdicion
              ? "Guardar cambios"
              : "Guardar director"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default DirectorFormDialog;