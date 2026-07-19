import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import {
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import LoginPage from "./pages/LoginPage";
import CatalogoPage from "./pages/CatalogoPage";

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
      <Route path="/catalogo" element={<CatalogoPage />} />
      <Route path="*" element={<InicioPage />} />
    </Routes>
  );
}
export default App;