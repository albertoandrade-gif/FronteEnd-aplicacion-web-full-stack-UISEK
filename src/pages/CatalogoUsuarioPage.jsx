import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import TrailerPlayer from "../components/TrailerPlayer";
import api from "../services/api";
import { obtenerUrlMedia } from "../utils/media";

function normalizarLista(datos) {
  if (Array.isArray(datos)) {
    return datos;
  }

  return Array.isArray(datos?.results) ? datos.results : [];
}

function mostrarGenero(genero) {
  if (!genero) {
    return "Sin género";
  }

  return genero
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letra) => letra.toUpperCase());
}

function obtenerTrailer(pelicula) {
  return (
    pelicula.trailer_url ||
    pelicula.url_trailer ||
    pelicula.trailer ||
    ""
  );
}

function CatalogoUsuarioPage() {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPeliculas = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta = await api.get("/peliculas/");
        setPeliculas(normalizarLista(respuesta.data));
      } catch (errorSolicitud) {
        console.error(errorSolicitud);
        setError("No se pudieron cargar las películas.");
      } finally {
        setCargando(false);
      }
    };

    cargarPeliculas();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" component="h1">
            Películas disponibles
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Consulta la información y reproduce los tráileres del
            catálogo.
          </Typography>
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
                md: "repeat(2, minmax(0, 1fr))",
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
                  flexDirection: { xs: "column", sm: "row" },
                  overflow: "hidden",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 5,
                  },
                }}
              >
                {pelicula.poster ? (
                  <CardMedia
                    component="img"
                    image={obtenerUrlMedia(pelicula.poster)}
                    alt={`Póster de ${pelicula.nombre}`}
                    sx={{
                      width: { xs: "100%", sm: 210 },
                      aspectRatio: "2 / 3",
                      objectFit: "contain",
                      bgcolor: "#111",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: { xs: "100%", sm: 210 },
                      minHeight: { xs: 260, sm: "100%" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      bgcolor: "grey.200",
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  >
                    Sin póster
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h5" component="h2">
                        {pelicula.nombre}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        {mostrarGenero(pelicula.genero)} ·{" "}
                        {pelicula.duracion} minutos
                      </Typography>
                    </Box>

                    <Stack spacing={0.5}>
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

                    <TrailerPlayer
                      url={obtenerTrailer(pelicula)}
                      titulo={pelicula.nombre}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Stack>
    </Container>
  );
}

export default CatalogoUsuarioPage;
