import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
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

import VendedorFormDialog from "../components/VendedorFormDialog";
import api from "../services/api";

function VendedoresPage() {
  const [vendedores, setVendedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [vendedorSeleccionado, setVendedorSeleccionado] =
    useState(null);

  const [vendedorEliminar, setVendedorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarVendedores = async () => {
    try {
      setCargando(true);
      setError("");
      const respuesta = await api.get("/vendedores/");
      setVendedores(respuesta.data);
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      setError("No se pudieron cargar los vendedores.");
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    cargarVendedores();
  }, []);
  const abrirNuevoVendedor = () => {
    setVendedorSeleccionado(null);
    setFormularioAbierto(true);
  };
  const abrirEditarVendedor = (vendedor) => {
    setVendedorSeleccionado(vendedor);
    setFormularioAbierto(true);
  };
  const handleVendedorGuardado = async () => {
    setFormularioAbierto(false);
    setMensaje(
      vendedorSeleccionado
        ? "Vendedor actualizado correctamente."
        : "Vendedor creado correctamente."
    );
    setVendedorSeleccionado(null);
    await cargarVendedores();
  };
  const eliminarVendedor = async () => {
    if (!vendedorEliminar) {
      return;
    }
    try {
      setEliminando(true);
      setError("");
      await api.delete(`/vendedores/${vendedorEliminar.id}/`);
      setVendedorEliminar(null);
      setMensaje("Vendedor eliminado correctamente.");
      await cargarVendedores();
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      setError("No se pudo eliminar el vendedor.");
    } finally {
      setEliminando(false);
    }
  };
  const obtenerInicial = (nombre) => {
    if (!nombre) {
      return "?";
    }
    return nombre.trim().charAt(0).toUpperCase();
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
              Vendedores
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Gestiona las plataformas y medios de distribución.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={abrirNuevoVendedor}
          >
            Nuevo vendedor
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
        ) : vendedores.length === 0 ? (
          <Alert severity="info">
            No existen vendedores registrados.
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
            {vendedores.map((vendedor) => (
              <Card
                key={vendedor.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 86,
                        height: 86,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontSize: 38,
                        fontWeight: 700,
                      }}
                    >
                      {obtenerInicial(vendedor.nombre)}
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h5">
                        {vendedor.nombre}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Tipo:{" "}
                        {vendedor.tipo_display || vendedor.tipo}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions
                  sx={{
                    px: 2,
                    pb: 2,
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => abrirEditarVendedor(vendedor)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setVendedorEliminar(vendedor)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Stack>
      <VendedorFormDialog
        open={formularioAbierto}
        vendedor={vendedorSeleccionado}
        onClose={() => {
          setFormularioAbierto(false);
          setVendedorSeleccionado(null);
        }}
        onSaved={handleVendedorGuardado}
      />
      <Dialog
        open={Boolean(vendedorEliminar)}
        onClose={() => {
          if (!eliminando) {
            setVendedorEliminar(null);
          }
        }}
      >
        <DialogTitle>Eliminar vendedor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar a{" "}
            <strong>{vendedorEliminar?.nombre}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setVendedorEliminar(null)}
            disabled={eliminando}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={eliminarVendedor}
            disabled={eliminando}
          >
            {eliminando ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
export default VendedoresPage;