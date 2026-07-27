import {
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import CatalogoUsuarioPage from "./pages/CatalogoUsuarioPage";
import CatalogoPage from "./pages/CatalogoPage";
import DirectoresPage from "./pages/DirectoresPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VendedoresPage from "./pages/VendedoresPage";
import {
  esAdministrador,
  estaAutenticado,
} from "./services/authService";

function InicioPage() {
  const navigate = useNavigate();

  const handleCatalogo = () => {
    if (!estaAutenticado()) {
      navigate("/login");
      return;
    }

    navigate(
      esAdministrador() ? "/catalogo" : "/catalogo-usuario"
    );
  };

  return (
    <Container maxWidth="md">
      <Stack
        spacing={3}
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Typography variant="h2" component="h1">
          Catálogo UISEK
        </Typography>
        <Typography variant="h6">
          Frontend - Alberto Andrade | Sebastián Rubio
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleCatalogo}
        >
          {estaAutenticado() ? "Ir al catálogo" : "Iniciar sesión"}
        </Button>
        {!estaAutenticado() && (
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/registro")}
          >
            Crear cuenta
          </Button>
        )}
      </Stack>
    </Container>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<InicioPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route
            path="/catalogo-usuario"
            element={<CatalogoUsuarioPage />}
          />

          <Route element={<AdminRoute />}>
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/directores" element={<DirectoresPage />} />
            <Route path="/vendedores" element={<VendedoresPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<InicioPage />} />
    </Routes>
  );
}

export default App;
