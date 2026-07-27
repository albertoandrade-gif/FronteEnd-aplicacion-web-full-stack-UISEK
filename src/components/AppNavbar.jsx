import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  cerrarSesion,
  esAdministrador,
} from "../services/authService";

function AppNavbar() {
  const navigate = useNavigate();
  const esAdmin = esAdministrador();
  const rutaPrincipal = esAdmin
    ? "/catalogo"
    : "/catalogo-usuario";

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
            onClick={() => navigate(rutaPrincipal)}
          >
            Catálogo UISEK
          </Typography>

          <Box sx={{ display: "flex", flexGrow: 1, gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate(rutaPrincipal)}
            >
              Películas
            </Button>

            {esAdmin && (
              <>
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
              </>
            )}
          </Box>

          <Chip
            label={esAdmin ? "Admin / Staff" : "Usuario"}
            size="small"
            sx={{
              mr: 2,
              display: { xs: "none", sm: "inline-flex" },
              bgcolor: esAdmin ? "secondary.main" : "common.white",
              color: esAdmin ? "secondary.contrastText" : "primary.main",
              fontWeight: 700,
            }}
          />

          <Button color="inherit" onClick={handleCerrarSesion}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppNavbar;
