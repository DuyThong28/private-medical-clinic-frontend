import { NavLink, Outlet } from "react-router-dom";

function MedicineView() {
  return (
    <>
      <div className="d-flex flex-column">
        <div style={{ height: "fit-content" }}>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="drugs"
              >
                Drugs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="units"
              >
                Units
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="usages"
              >
                Usages
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="diseases"
              >
                Diseases
              </NavLink>
            </li>
          </ul>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default MedicineView;
