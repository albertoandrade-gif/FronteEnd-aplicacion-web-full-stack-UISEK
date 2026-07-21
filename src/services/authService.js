import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

export async function iniciarSesion(username, password) {
  if (!CLIENT_ID) {
    throw new Error("Falta configurar VITE_CLIENT_ID en .env.local.");
  }

  const datos = new URLSearchParams();
  datos.append("grant_type", "password");
  datos.append("username", username);
  datos.append("password", password);
  datos.append("client_id", CLIENT_ID);

  if (CLIENT_SECRET) {
    datos.append("client_secret", CLIENT_SECRET);
  }

  const respuesta = await axios.post(`${API_URL}/api/v1/o/token/`, datos, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const { access_token, refresh_token } = respuesta.data;

  if (!access_token) {
    throw new Error("Respuesta de autenticación inválida.");
  }

  localStorage.setItem("access_token", access_token);

  if (refresh_token) {
    localStorage.setItem("refresh_token", refresh_token);
  } else {
    localStorage.removeItem("refresh_token");
  }

  try {
    const perfilRespuesta = await axios.get(
      `${API_URL}/api/v1/catalog/usuarios/perfil/`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    localStorage.setItem("is_staff", String(perfilRespuesta.data.is_staff));
  } catch (errorPerfil) {
    cerrarSesion();
    throw new Error("No se pudo obtener el perfil del usuario.");
  }

  return respuesta.data;
}

export function cerrarSesion() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("is_staff");
}

export function estaAutenticado() {
  return Boolean(localStorage.getItem("access_token"));
}

export function esAdministrador() {
  return localStorage.getItem("is_staff") === "true";
}