import { NavLink, Outlet } from "react-router-dom";
import "./Medicine.scss";

function MedicineView() {
  return (
    <>
    <div className="d-flex flex-column">
    <div className="medicine-navigation">
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
