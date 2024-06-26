import { NavLink, Outlet, useRouteError } from "react-router-dom";
import "./Users.scss";
import useAuth from "../../../hooks/useAuth";

function UsersView() {
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth || (auth.isAuth && !permission.includes("RUser"))) {
    throw error;
  }
  return (
    // <div className="col h-100">
      <div className="d-flex flex-column w-100 h-100 user-navigation">
        <nav className="nav nav-pills gap-4 justify-content-center border-bottom border-2 p-2">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "nav-link shadow-sm bg-white  nav-bar"
                : "nav-link   nav-bar-active"
            }
            to="members"
          >
            Thành viên
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "nav-link shadow-sm bg-white  nav-bar"
                : "nav-link   nav-bar-active"
            }
            to="roles"
          >
            Vai trò
          </NavLink>
        </nav>
        <div className="row w-100 h-100 overflow-hidden">
          <Outlet />
        </div>
      </div>
    // </div>
  );
}

export default UsersView;
