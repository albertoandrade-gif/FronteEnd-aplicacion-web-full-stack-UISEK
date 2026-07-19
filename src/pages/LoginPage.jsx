import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { iniciarSesion } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!usuario.trim() || !password.trim()) {
      setError("Ingresa el usuario y la contraseña.");
      return;
    }
    try {
      setCargando(true);
      setError("");
      await iniciarSesion(usuario, password);
      navigate("/catalogo");
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      if (errorSolicitud.response?.status === 400) {
        setError("Usuario o contraseña incorrectos.");
      } else {
        setError("No se pudo conectar con el backend.");
      }
    } finally {
      setCargando(false);
    }
  };
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper elevation={4} sx={{ width: "100%", p: 4 }}>
          <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <Typography variant="h4" textAlign="center">
              Iniciar sesión
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Usuario"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              disabled={cargando}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={cargando}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={cargando}
            >
              {cargando ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Ingresar"
              )}
            </Button>
            <Button
              onClick={() => navigate("/")}
              disabled={cargando}
            >
              Volver
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
export default LoginPage;