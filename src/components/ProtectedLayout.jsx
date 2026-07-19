import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";

function ProtectedLayout() {
  return (
    <>
      <AppNavbar />
      <Outlet />
    </>
  );
}
export default ProtectedLayout;