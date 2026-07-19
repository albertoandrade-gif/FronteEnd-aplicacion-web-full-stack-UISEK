import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import PeliculaFormDialog from "../components/PeliculaFormDialog";
import api from "../services/api";
import { cerrarSesion } from "../services/authService";

function CatalogoPage() {
  const navigate = useNavigate();

  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [formularioAbierto, setFormularioAbierto] = useState(false);

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
  const handlePeliculaCreada = async () => {
    setFormularioAbierto(false);
    await cargarPeliculas();
  };
  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/login");
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
          <Typography variant="h3" component="h1">
            Catálogo de películas
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => setFormularioAbierto(true)}
            >
              Nueva película
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCerrarSesion}
            >
              Cerrar sesión
            </Button>
          </Stack>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
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
              <Card key={pelicula.id} sx={{ height: "100%" }}>
                <CardContent>
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
              </Card>
            ))}
          </Box>
        )}
      </Stack>
      <PeliculaFormDialog
        open={formularioAbierto}
        onClose={() => setFormularioAbierto(false)}
        onCreated={handlePeliculaCreada}
      />
    </Container>
  );
}
export default CatalogoPage;