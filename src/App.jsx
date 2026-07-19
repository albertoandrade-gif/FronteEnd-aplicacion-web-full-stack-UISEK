import { Button, Container, Stack, Typography } from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedLayout from "./components/ProtectedLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import CatalogoPage from "./pages/CatalogoPage";
import DirectoresPage from "./pages/DirectoresPage";
import LoginPage from "./pages/LoginPage";
import VendedoresPage from "./pages/VendedoresPage";

function InicioPage() {
  const navigate = useNavigate();
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
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </Button>
      </Stack>
    </Container>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<InicioPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/directores" element={<DirectoresPage />} />
          <Route path="/vendedores" element={<VendedoresPage />} />
        </Route>
      </Route>
      <Route path="*" element={<InicioPage />} />
    </Routes>
  );
}

export default App;