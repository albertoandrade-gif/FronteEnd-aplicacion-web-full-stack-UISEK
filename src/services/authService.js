import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

export async function iniciarSesion(username, password) {
  const datos = new URLSearchParams();

  datos.append("grant_type", "password");
  datos.append("username", username);
  datos.append("password", password);
  datos.append("client_id", CLIENT_ID);
  datos.append("client_secret", CLIENT_SECRET);
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

  localStorage.setItem("access_token", respuesta.data.access_token);
  localStorage.setItem("refresh_token", respuesta.data.refresh_token);

  return respuesta.data;
}

export function cerrarSesion() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function estaAutenticado() {
  return Boolean(localStorage.getItem("access_token"));
}