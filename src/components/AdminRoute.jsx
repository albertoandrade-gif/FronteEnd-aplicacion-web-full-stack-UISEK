import { Navigate, Outlet } from "react-router-dom";

import {
  esAdministrador,
  estaAutenticado,
} from "../services/authService";

function AdminRoute() {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }

  if (!esAdministrador()) {
    return <Navigate to="/catalogo-usuario" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
