import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export async function iniciarSesion(username, password) {
  if (!CLIENT_ID) {
    throw new Error(
      "Falta configurar VITE_CLIENT_ID en el archivo .env.local."
    );
  }

  const datos = new URLSearchParams();
  datos.append("grant_type", "password");
  datos.append("username", username);
  datos.append("password", password);
  datos.append("client_id", CLIENT_ID);
  datos.append("scope", "read write");


  const respuesta = await axios.post(
    `${API_URL}/api/v1/o/token/`,
    datos,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, refresh_token } = respuesta.data;

  if (!access_token) {
    throw new Error(
      "El backend no devolvió un token de acceso válido."
    );
  }

  localStorage.setItem("access_token", access_token);

  if (refresh_token) {
    localStorage.setItem("refresh_token", refresh_token);
  } else {
    localStorage.removeItem("refresh_token");
  }

  // ---- NUEVA LÓGICA: Obtener perfil del usuario para conocer sus permisos ----
  try {
    const perfilRespuesta = await axios.get(`${API_URL}/api/v1/catalog/usuarios/me/`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    localStorage.setItem("is_staff", String(perfilRespuesta.data.is_staff));
  } catch (errorPerfil) {
    cerrarSesion();
    throw new Error("No se pudieron verificar los permisos del usuario.");
  }

  return respuesta.data;
}

export function cerrarSesion() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("is_staff"); // Limpieza obligatoria del rol
}

export function estaAutenticado() {
  return Boolean(localStorage.getItem("access_token"));
}

// Función de utilidad para verificar el rol en los componentes
export function esAdministrador() {
  return localStorage.getItem("is_staff") === "true";
}