import SideBar from "../components/SideBar";
import { Outlet } from "react-router";

function RootLayout() {
  return (
    <>
      <div className="d-flex felx-row">
        <SideBar />
        <Outlet />
      </div>
    </>
  );
}

export default RootLayout;
