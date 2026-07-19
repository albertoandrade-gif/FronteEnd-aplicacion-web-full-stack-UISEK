import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import api from "../services/api";
import { obtenerUrlMedia } from "../utils/media";

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
  const [foto, setFoto] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const esEdicion = Boolean(director);

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");
    setFoto(null);

    if (director) {
      setFormulario({
        nombre: director.nombre ?? "",
        fecha_nacimiento: director.fecha_nacimiento ?? "",
        premios_ganados: director.premios_ganados ?? 0,
        biografia: director.biografia ?? "",
      });

      setVistaPrevia(obtenerUrlMedia(director.foto));
    } else {
      setFormulario(FORMULARIO_INICIAL);
      setVistaPrevia("");
    }
  }, [open, director]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleFotoChange = (event) => {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError("La fotografía no puede superar los 5 MB.");
      return;
    }

    if (vistaPrevia.startsWith("blob:")) {
      URL.revokeObjectURL(vistaPrevia);
    }

    setFoto(archivo);
    setVistaPrevia(URL.createObjectURL(archivo));
    setError("");
  };

  const handleCerrar = () => {
    if (guardando) {
      return;
    }

    if (vistaPrevia.startsWith("blob:")) {
      URL.revokeObjectURL(vistaPrevia);
    }

    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formulario.nombre.trim() ||
      !formulario.fecha_nacimiento
    ) {
      setError("Completa los campos obligatorios.");
      return;
    }

    const datos = new FormData();

    datos.append("nombre", formulario.nombre.trim());

    datos.append(
      "fecha_nacimiento",
      formulario.fecha_nacimiento
    );

    datos.append(
      "premios_ganados",
      String(formulario.premios_ganados || 0)
    );

    datos.append(
      "biografia",
      formulario.biografia.trim()
    );

    if (foto) {
      datos.append("foto", foto);
    }

    try {
      setGuardando(true);
      setError("");

      if (esEdicion) {
        await api.patch(
          `/directores/${director.id}/`,
          datos
        );
      } else {
        await api.post("/directores/", datos);
      }

      onSaved();
    } catch (errorSolicitud) {
      console.error(errorSolicitud);

      const detalle = errorSolicitud.response?.data;

      setError(
        detalle
          ? `No se pudo guardar: ${JSON.stringify(detalle)}`
          : "No se pudo conectar con el backend."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCerrar}
      fullWidth
      maxWidth="sm"
    >
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
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {vistaPrevia ? (
            <Box
              component="img"
              src={vistaPrevia}
              alt="Vista previa del director"
              sx={{
                width: 190,
                height: 190,
                objectFit: "cover",
                borderRadius: "50%",
                alignSelf: "center",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "grey.100",
              }}
            />
          ) : (
            <Box
              sx={{
                width: 190,
                height: 190,
                borderRadius: "50%",
                alignSelf: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.200",
                color: "text.secondary",
              }}
            >
              Sin fotografía
            </Box>
          )}

          <Button
            variant="outlined"
            component="label"
          >
            Seleccionar fotografía

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={handleFotoChange}
            />
          </Button>

          {foto && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Archivo seleccionado: {foto.name}
            </Typography>
          )}

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
            required
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Premios ganados"
            name="premios_ganados"
            type="number"
            value={formulario.premios_ganados}
            onChange={handleChange}
            fullWidth
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
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
        <Button
          onClick={handleCerrar}
          disabled={guardando}
        >
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