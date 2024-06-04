import SideBar from "../components/SideBar";
import { Outlet, useRouteError } from "react-router";
import useAuth from "../hooks/useAuth";


function RootLayout() {
  const { auth } = useAuth();
  const error = useRouteError();

  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth) {
    throw error;
  }

  return (
    <>
      <div className="d-flex felx-row h-100">
        <div style={{ width: "280px", height: "100%" }}>
          <SideBar />
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default RootLayout;
