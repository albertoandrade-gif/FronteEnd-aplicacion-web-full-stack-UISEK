import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
function ProtectedLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppNavbar />
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}
export default ProtectedLayout;
