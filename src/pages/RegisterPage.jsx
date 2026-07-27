import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegistroExitoso = () => {
    navigate("/login", {
      replace: true,
      state: {
        registroExitoso:
          "Cuenta creada correctamente. Ya puedes iniciar sesión.",
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper elevation={4} sx={{ width: "100%", p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" component="h1">
                Crear cuenta
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Regístrate para consultar el catálogo de películas.
              </Typography>
            </Box>

            <RegisterForm
              onSuccess={handleRegistroExitoso}
              onCancel={() => navigate("/login")}
            />
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default RegisterPage;
