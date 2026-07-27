import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";

import { registrarUsuario } from "../services/authService";

const FORMULARIO_INICIAL = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirm: "",
};

function obtenerMensajeError(errorSolicitud) {
  const datos = errorSolicitud.response?.data;

  if (!datos) {
    return "No se pudo conectar con el backend.";
  }

  if (typeof datos === "string") {
    return datos;
  }

  const mensajes = Object.entries(datos).flatMap(([campo, valor]) => {
    const detalles = Array.isArray(valor) ? valor : [valor];
    return detalles.map((detalle) => `${campo}: ${detalle}`);
  });

  return mensajes.join(" ") || "No se pudo registrar el usuario.";
}

function RegisterForm({ onSuccess, onCancel }) {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formulario.username.trim() ||
      !formulario.email.trim() ||
      !formulario.password ||
      !formulario.password_confirm
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (formulario.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (formulario.password !== formulario.password_confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await registrarUsuario({
        username: formulario.username.trim(),
        first_name: formulario.first_name.trim(),
        last_name: formulario.last_name.trim(),
        email: formulario.email.trim(),
        password: formulario.password,
        password_confirm: formulario.password_confirm,
      });

      setFormulario(FORMULARIO_INICIAL);
      onSuccess?.();
    } catch (errorSolicitud) {
      console.error(errorSolicitud);
      setError(obtenerMensajeError(errorSolicitud));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={handleSubmit}
    >
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Usuario"
        name="username"
        value={formulario.username}
        onChange={handleChange}
        autoComplete="username"
        disabled={guardando}
        required
        fullWidth
      />

      <TextField
        label="Nombres"
        name="first_name"
        value={formulario.first_name}
        onChange={handleChange}
        autoComplete="given-name"
        disabled={guardando}
        fullWidth
      />

      <TextField
        label="Apellidos"
        name="last_name"
        value={formulario.last_name}
        onChange={handleChange}
        autoComplete="family-name"
        disabled={guardando}
        fullWidth
      />

      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        value={formulario.email}
        onChange={handleChange}
        autoComplete="email"
        disabled={guardando}
        required
        fullWidth
      />

      <TextField
        label="Contraseña"
        name="password"
        type="password"
        value={formulario.password}
        onChange={handleChange}
        autoComplete="new-password"
        disabled={guardando}
        helperText="Mínimo 8 caracteres."
        required
        fullWidth
      />

      <TextField
        label="Confirmar contraseña"
        name="password_confirm"
        type="password"
        value={formulario.password_confirm}
        onChange={handleChange}
        autoComplete="new-password"
        disabled={guardando}
        required
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={guardando}
      >
        {guardando ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Crear cuenta"
        )}
      </Button>

      <Button onClick={onCancel} disabled={guardando}>
        Ya tengo una cuenta
      </Button>
    </Stack>
  );
}

export default RegisterForm;
