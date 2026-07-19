import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import PeliculaFormDialog from "../components/PeliculaFormDialog";
import api from "../services/api";
import { obtenerUrlMedia } from "../utils/media";

function CatalogoPage() {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [peliculaSeleccionada, setPeliculaSeleccionada] =
    useState(null);

  const [peliculaEliminar, setPeliculaEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarPeliculas = async () => {
    try {
      setCargando(true);
      setError("");
      const respuesta = await api.get("/peliculas/");
      setPeliculas(respuesta.data);
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      setError("No se pudieron cargar las películas.");
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    cargarPeliculas();
  }, []);
  const abrirNuevaPelicula = () => {
    setPeliculaSeleccionada(null);
    setFormularioAbierto(true);
  };
  const abrirEditarPelicula = (pelicula) => {
    setPeliculaSeleccionada(pelicula);
    setFormularioAbierto(true);
  };
  const handlePeliculaGuardada = async () => {
    setFormularioAbierto(false);
    setMensaje(
      peliculaSeleccionada
        ? "Película actualizada correctamente."
        : "Película creada correctamente."
    );
    setPeliculaSeleccionada(null);
    await cargarPeliculas();
  };
  const eliminarPelicula = async () => {
    if (!peliculaEliminar) {
      return;
    }
    try {
      setEliminando(true);
      setError("");
      await api.delete(`/peliculas/${peliculaEliminar.id}/`);
      setMensaje("Película eliminada correctamente.");
      setPeliculaEliminar(null);
      await cargarPeliculas();
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      setError("No se pudo eliminar la película.");
    } finally {
      setEliminando(false);
    }
  };
  const mostrarGenero = (genero) => {
    if (!genero) {
      return "Sin género";
    }
    return genero
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/^\w/, (letra) => letra.toUpperCase());
  };
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={4}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h3" component="h1">
              Catálogo de películas
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Administra las películas, sus directores y vendedores.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={abrirNuevaPelicula}
          >
            Nueva película
          </Button>
        </Box>
        {mensaje && (
          <Alert severity="success" onClose={() => setMensaje("")}>
            {mensaje}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {cargando ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : peliculas.length === 0 ? (
          <Alert severity="info">
            No existen películas registradas.
          </Alert>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {peliculas.map((pelicula) => (
              <Card
                key={pelicula.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                {pelicula.poster ? (
                  <CardMedia
                    component="img"
                    image={obtenerUrlMedia(pelicula.poster)}
                    alt={`Póster de ${pelicula.nombre}`}
                    sx={{
                      width: "100%",
                      aspectRatio: "2 / 3",
                      objectFit: "contain",
                      objectPosition: "center",
                      bgcolor: "#111",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "2 / 3",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      bgcolor: "grey.200",
                      color: "text.secondary",
                    }}
                  >
                    Sin póster
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="h5">
                      {pelicula.nombre}
                    </Typography>
                    <Typography>
                      Duración: {pelicula.duracion} minutos
                    </Typography>
                    <Typography>
                      Género: {mostrarGenero(pelicula.genero)}
                    </Typography>
                    <Typography>
                      Estreno: {pelicula.fecha_lanzamiento}
                    </Typography>
                    <Typography>
                      Director:{" "}
                      {pelicula.director_detail?.nombre ||
                        pelicula.director}
                    </Typography>
                    <Typography color="text.secondary">
                      Vendedores:{" "}
                      {pelicula.vendedores_detail?.length
                        ? pelicula.vendedores_detail
                            .map((vendedor) => vendedor.nombre)
                            .join(", ")
                        : "Sin vendedores"}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => abrirEditarPelicula(pelicula)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setPeliculaEliminar(pelicula)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Stack>
      <PeliculaFormDialog
        open={formularioAbierto}
        pelicula={peliculaSeleccionada}
        onClose={() => {
          setFormularioAbierto(false);
          setPeliculaSeleccionada(null);
        }}
        onSaved={handlePeliculaGuardada}
      />
      <ConfirmDeleteDialog
        open={Boolean(peliculaEliminar)}
        nombre={peliculaEliminar?.nombre}
        eliminando={eliminando}
        onCancel={() => setPeliculaEliminar(null)}
        onConfirm={eliminarPelicula}
      />
    </Container>
  );
}
export default CatalogoPage;