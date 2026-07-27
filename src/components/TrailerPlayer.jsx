import { Alert, Box, Typography } from "@mui/material";

function obtenerConfiguracionTrailer(urlTrailer) {
  if (!urlTrailer) {
    return null;
  }

  try {
    const url = new URL(urlTrailer);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId
        ? {
            tipo: "iframe",
            url: `https://www.youtube-nocookie.com/embed/${videoId}`,
          }
        : null;
    }

    if (host.endsWith("youtube.com")) {
      const partes = url.pathname.split("/").filter(Boolean);
      const videoId =
        url.searchParams.get("v") ||
        (["embed", "shorts"].includes(partes[0]) ? partes[1] : "");

      return videoId
        ? {
            tipo: "iframe",
            url: `https://www.youtube-nocookie.com/embed/${videoId}`,
          }
        : null;
    }

    if (host.endsWith("vimeo.com")) {
      const videoId = url.pathname.split("/").filter(Boolean).at(-1);
      return videoId
        ? {
            tipo: "iframe",
            url: `https://player.vimeo.com/video/${videoId}`,
          }
        : null;
    }

    if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
      return {
        tipo: "video",
        url: url.toString(),
      };
    }
  } catch {
    return null;
  }

  return null;
}

function TrailerPlayer({ url, titulo }) {
  if (!url) {
    return (
      <Alert severity="info" variant="outlined">
        Tráiler no disponible.
      </Alert>
    );
  }

  const configuracion = obtenerConfiguracionTrailer(url);

  if (!configuracion) {
    return (
      <Alert severity="warning" variant="outlined">
        La URL del tráiler no es compatible. Usa YouTube, Vimeo o un
        archivo MP4, WebM u OGG.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        Tráiler
      </Typography>

      {configuracion.tipo === "video" ? (
        <Box
          component="video"
          src={configuracion.url}
          controls
          preload="metadata"
          aria-label={`Tráiler de ${titulo}`}
          sx={{
            display: "block",
            width: "100%",
            aspectRatio: "16 / 9",
            bgcolor: "#000",
            borderRadius: 2,
          }}
        />
      ) : (
        <Box
          component="iframe"
          src={configuracion.url}
          title={`Tráiler de ${titulo}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          sx={{
            display: "block",
            width: "100%",
            aspectRatio: "16 / 9",
            border: 0,
            bgcolor: "#000",
            borderRadius: 2,
          }}
        />
      )}
    </Box>
  );
}

export default TrailerPlayer;
