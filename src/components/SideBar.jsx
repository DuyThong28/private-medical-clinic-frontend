import "./SideBar.scss";
import { NavLink, Link } from "react-router-dom";

function SideBar() {
  return (
    <>
      <div>
        <div className="d-flex flex-column  p-3 bg-body-tertiary sidebar">
          <div>
            <Link
              to="home"
              className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
            >
              <svg className="bi pe-none me-2" width="40" height="32">
                <use href="#bootstrap" />
              </svg>
              <span className="fs-4">Medical Clinic</span>
            </Link>
            <ul className="nav nav-pills flex-column mb-auto mt-5">
              <li className="nav-item">
                <NavLink
                  to="home"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#home" />
                  </svg>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="examinations"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#speedometer2" />
                  </svg>
                  Examinations
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="patients"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#table" />
                  </svg>
                  Patients
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="reports"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#grid" />
                  </svg>
                  Reports
                </NavLink>
              </li>
              <li className="mb-1">
                <button
                  className="btn btn-toggle d-inline-flex  rounded border-0 collapsed nav-link"
                  data-bs-toggle="collapse"
                  data-bs-target="#dashboard-collapse"
                  aria-expanded="false"
                >
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#people-circle" />
                  </svg>
                  Settings
                </button>
                <div className="collapse" id="dashboard-collapse">
                  <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li>
                      <NavLink
                        to="settings/users"
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                      >
                        <svg className="bi pe-none me-2" width="16" height="16">
                          <use href="#people-circle" />
                        </svg>
                        Users
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="settings/principle"
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                      >
                        <svg className="bi pe-none me-2" width="16" height="16">
                          <use href="#people-circle" />
                        </svg>
                        Principle
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="settings/medicine"
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                      >
                        <svg className="bi pe-none me-2" width="16" height="16">
                          <use href="#people-circle" />
                        </svg>
                        Medicine
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="settings/password"
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                      >
                        <svg className="bi pe-none me-2" width="16" height="16">
                          <use href="#people-circle" />
                        </svg>
                        Password
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="mt-auto" style={{ height: "fit-content" }}>
            <hr />
            <div>
              <a href="#" className="nav-link link-body-emphasis">
                <svg className="bi pe-none me-2" width="16" height="16">
                  <use href="#table" />
                </svg>
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
