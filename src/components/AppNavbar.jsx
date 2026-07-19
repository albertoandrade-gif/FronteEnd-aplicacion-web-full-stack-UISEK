import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { cerrarSesion } from "../services/authService";

function AppNavbar() {
  const navigate = useNavigate();
  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/login");
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            sx={{
              mr: 4,
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => navigate("/catalogo")}
          >
            Catálogo UISEK
          </Typography>
          <Box sx={{ display: "flex", flexGrow: 1, gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/catalogo")}
            >
              Películas
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/directores")}
            >
              Directores
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/vendedores")}
            >
              Vendedores
            </Button>
          </Box>
          <Button color="inherit" onClick={handleCerrarSesion}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppNavbar;