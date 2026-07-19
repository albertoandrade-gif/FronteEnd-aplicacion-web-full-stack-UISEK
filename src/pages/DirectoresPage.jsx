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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import DirectorFormDialog from "../components/DirectorFormDialog";
import api from "../services/api";
import { obtenerUrlMedia } from "../utils/media";

function DirectoresPage() {
  const [directores, setDirectores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [directorSeleccionado, setDirectorSeleccionado] =
    useState(null);

  const [directorEliminar, setDirectorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarDirectores = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/directores/");
      setDirectores(respuesta.data);
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      setError("No se pudieron cargar los directores.");
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    cargarDirectores();
  }, []);
  const abrirNuevoDirector = () => {
    setDirectorSeleccionado(null);
    setFormularioAbierto(true);
  };
  const abrirEditarDirector = (director) => {
    setDirectorSeleccionado(director);
    setFormularioAbierto(true);
  };
  const handleDirectorGuardado = async () => {
    setFormularioAbierto(false);
    setMensaje(
      directorSeleccionado
        ? "Director actualizado correctamente."
        : "Director creado correctamente."
    );
    setDirectorSeleccionado(null);
    await cargarDirectores();
  };
  const eliminarDirector = async () => {
    if (!directorEliminar) {
      return;
    }

    try {
      setEliminando(true);
      setError("");
      await api.delete(`/directores/${directorEliminar.id}/`);
      setDirectorEliminar(null);
      setMensaje("Director eliminado correctamente.");
      await cargarDirectores();
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      setError(
        "No se pudo eliminar el director. Puede tener películas relacionadas."
      );
    } finally {
      setEliminando(false);
    }
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
              Directores
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Registra información y fotografías de los directores.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={abrirNuevoDirector}
          >
            Nuevo director
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
        ) : directores.length === 0 ? (
          <Alert severity="info">
            No existen directores registrados.
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
            {directores.map((director) => (
              <Card
                key={director.id}
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
                {director.foto ? (
                  <CardMedia
                    component="img"
                    image={obtenerUrlMedia(director.foto)}
                    alt={`Foto de ${director.nombre}`}
                    sx={{
                      width: "100%",
                      height: 300,
                      objectFit: "contain",
                      objectPosition: "center",
                      bgcolor: "#111",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 300,
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
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="h5">
                      {director.nombre}
                    </Typography>
                    <Typography>
                      Nacimiento: {director.fecha_nacimiento}
                    </Typography>
                    <Typography>
                      Premios ganados: {director.premios_ganados}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {director.biografia ||
                        "Sin biografía registrada."}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => abrirEditarDirector(director)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setDirectorEliminar(director)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Stack>
      <DirectorFormDialog
        open={formularioAbierto}
        director={directorSeleccionado}
        onClose={() => {
          setFormularioAbierto(false);
          setDirectorSeleccionado(null);
        }}
        onSaved={handleDirectorGuardado}
      />
      <Dialog
        open={Boolean(directorEliminar)}
        onClose={() => {
          if (!eliminando) {
            setDirectorEliminar(null);
          }
        }}
      >
        <DialogTitle>Eliminar director</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar a{" "}
            <strong>{directorEliminar?.nombre}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDirectorEliminar(null)}
            disabled={eliminando}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={eliminarDirector}
            disabled={eliminando}
          >
            {eliminando ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
export default DirectoresPage;