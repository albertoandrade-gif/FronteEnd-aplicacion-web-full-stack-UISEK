export function obtenerUrlMedia(ruta) {
  if (!ruta) {
    return "";
  }

  const rutaImagen =
    typeof ruta === "object" && ruta.url
      ? ruta.url
      : String(ruta);

  if (
    rutaImagen.startsWith("http://") ||
    rutaImagen.startsWith("https://") ||
    rutaImagen.startsWith("blob:")
  ) {
    return rutaImagen;
  }

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";

  let origenBackend = "http://127.0.0.1:8000";

  try {
    origenBackend = new URL(apiUrl).origin;
  } catch (error) {
    console.error("VITE_API_URL no es válida:", error);
  }

  const rutaLimpia = rutaImagen.startsWith("/")
    ? rutaImagen
    : `/${rutaImagen}`;

  return `${origenBackend}${rutaLimpia}`;
}