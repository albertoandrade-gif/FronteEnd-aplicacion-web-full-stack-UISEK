import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import api from "../services/api";
import { obtenerUrlMedia } from "../utils/media";

const GENEROS = [
  { value: "ACCION", label: "Acción" },
  { value: "COMEDIA", label: "Comedia" },
  { value: "DRAMA", label: "Drama" },
  { value: "TERROR", label: "Terror" },
  { value: "CIENCIA_FICCION", label: "Ciencia ficción" },
  { value: "ANIMACION", label: "Animación" },
  { value: "DOCUMENTAL", label: "Documental" },
  { value: "ROMANCE", label: "Romance" },
  { value: "AVENTURA", label: "Aventura" },
  { value: "FANTASIA", label: "Fantasía" },
  { value: "MUSICAL", label: "Musical" },
  { value: "SUSPENSE", label: "Suspenso" },
  { value: "WESTERN", label: "Western" },
];

const FORMULARIO_INICIAL = {
  nombre: "",
  duracion: "",
  fecha_lanzamiento: "",
  genero: "DRAMA",
  director: "",
  vendedores: [],
};

function PeliculaFormDialog({
  open,
  onClose,
  onSaved,
  pelicula,
}) {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [directores, setDirectores] = useState([]);
  const [vendedores, setVendedores] = useState([]);

  const [poster, setPoster] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState("");

  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const esEdicion = Boolean(pelicula);

  useEffect(() => {
    if (!open) {
      return;
    }
    cargarDatosRelacionados();
    setPoster(null);
    setError("");
    if (pelicula) {
      setFormulario({
        nombre: pelicula.nombre ?? "",
        duracion: pelicula.duracion ?? "",
        fecha_lanzamiento: pelicula.fecha_lanzamiento ?? "",
        genero: pelicula.genero ?? "DRAMA",
        director:
          pelicula.director_detail?.id ??
          pelicula.director ??
          "",
        vendedores:
          pelicula.vendedores?.map?.((valor) =>
            typeof valor === "object" ? valor.id : valor
          ) ??
          pelicula.vendedores_detail?.map((vendedor) => vendedor.id) ??
          [],
      });

      setVistaPrevia(obtenerUrlMedia(pelicula.poster));
    } else {
      setFormulario(FORMULARIO_INICIAL);
      setVistaPrevia("");
    }
  }, [open, pelicula]);

  const cargarDatosRelacionados = async () => {
    try {
      setCargandoDatos(true);

      const [respuestaDirectores, respuestaVendedores] =
        await Promise.all([
          api.get("/directores/"),
          api.get("/vendedores/"),
        ]);

      setDirectores(respuestaDirectores.data);
      setVendedores(respuestaVendedores.data);
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      setError("No se pudieron cargar directores y vendedores.");
    } finally {
      setCargandoDatos(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handlePosterChange = (event) => {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen.");
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5 MB.");
      return;
    }

    if (vistaPrevia.startsWith("blob:")) {
      URL.revokeObjectURL(vistaPrevia);
    }

    setPoster(archivo);
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
      !formulario.duracion ||
      !formulario.fecha_lanzamiento ||
      !formulario.director
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    const datos = new FormData();
    datos.append("nombre", formulario.nombre.trim());
    datos.append("duracion", String(formulario.duracion));
    datos.append(
      "fecha_lanzamiento",
      formulario.fecha_lanzamiento
    );
    datos.append("genero", formulario.genero);
    datos.append("director", String(formulario.director));
    formulario.vendedores.forEach((vendedorId) => {
      datos.append("vendedores", String(vendedorId));
    });
    if (poster) {
      datos.append("poster", poster);
    }
    try {
      setGuardando(true);
      setError("");
      if (esEdicion) {
        await api.patch(
          `/peliculas/${pelicula.id}/`,
          datos
        );
      } else {
        await api.post("/peliculas/", datos);
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
        {esEdicion ? "Editar película" : "Nueva película"}
      </DialogTitle>
      <DialogContent>
        {cargandoDatos ? (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack
            component="form"
            id="formulario-pelicula"
            spacing={3}
            sx={{ pt: 1 }}
            onSubmit={handleSubmit}
          >
            {error && <Alert severity="error">{error}</Alert>}
            {vistaPrevia && (
              <Box
                component="img"
                src={vistaPrevia}
                alt="Vista previa del póster"
                sx={{
                  width: "100%",
                  maxHeight: 360,
                  objectFit: "contain",
                  borderRadius: 2,
                  bgcolor: "grey.100",
                }}
              />
            )}
            <Button variant="outlined" component="label">
              Seleccionar póster
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handlePosterChange}
              />
            </Button>
            {poster && (
              <Typography variant="body2" color="text.secondary">
                Archivo seleccionado: {poster.name}
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
              label="Duración en minutos"
              name="duracion"
              type="number"
              value={formulario.duracion}
              onChange={handleChange}
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
              required
              fullWidth
            />
            <TextField
              label="Fecha de lanzamiento"
              name="fecha_lanzamiento"
              type="date"
              value={formulario.fecha_lanzamiento}
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
              label="Género"
              name="genero"
              value={formulario.genero}
              onChange={handleChange}
              select
              required
              fullWidth
            >
              {GENEROS.map((genero) => (
                <MenuItem key={genero.value} value={genero.value}>
                  {genero.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Director"
              name="director"
              value={formulario.director}
              onChange={handleChange}
              select
              required
              fullWidth
            >
              {directores.map((director) => (
                <MenuItem key={director.id} value={director.id}>
                  {director.nombre}
                </MenuItem>
              ))}
            </TextField>
            <FormControl fullWidth>
              <InputLabel id="vendedores-label">
                Vendedores
              </InputLabel>

              <Select
                labelId="vendedores-label"
                name="vendedores"
                value={formulario.vendedores}
                label="Vendedores"
                onChange={handleChange}
                multiple
              >
                {vendedores.map((vendedor) => (
                  <MenuItem key={vendedor.id} value={vendedor.id}>
                    {vendedor.nombre} -{" "}
                    {vendedor.tipo_display || vendedor.tipo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCerrar} disabled={guardando}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="formulario-pelicula"
          variant="contained"
          disabled={guardando || cargandoDatos}
        >
          {guardando
            ? "Guardando..."
            : esEdicion
              ? "Guardar cambios"
              : "Guardar película"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default PeliculaFormDialog;