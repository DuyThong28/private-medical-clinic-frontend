import './SideBar.scss';

function SideBar() {
  return (
    <>
      <div>
        <div className="d-flex flex-column  p-3 bg-body-tertiary sidebar">
          <div>
            <a
              href="/"
              className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
            >
              <svg className="bi pe-none me-2" width="40" height="32">
                <use href="#bootstrap" />
              </svg>
              <span className="fs-4">Medical Clinic</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <a href="#" className="nav-link active" aria-current="page">
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#home" />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="nav-link link-body-emphasis">
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#speedometer2" />
                  </svg>
                  Examinations
                </a>
              </li>
              <li>
                <a href="#" className="nav-link link-body-emphasis">
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#table" />
                  </svg>
                  Patients
                </a>
              </li>
              <li>
                <a href="#" className="nav-link link-body-emphasis">
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#grid" />
                  </svg>
                  Reports
                </a>
              </li>
              <li>
                <a href="#" className="nav-link link-body-emphasis">
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use href="#people-circle" />
                  </svg>
                  Settings
                </a>
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
