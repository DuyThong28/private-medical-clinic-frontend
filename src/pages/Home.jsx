import "./Home.scss";
import CalendarSelectDay from "../components/CalendarSelectDay";
import { MyProvider } from "../components/SelectDayContext";
import PatientOfDay from "../components/PatientOfDay";
import NumberOfPatient from "../components/NumberOfPatient";
import TopDrug from "../components/TopDrug";
import useAuth from "../hooks/useAuth";
import { useRouteError } from "react-router";
import logo from "../assets/logo.svg";

function HomePage() {
  const { auth } = useAuth();
  const error = useRouteError();
  if (auth.isPending) {
    return <></>;
  }
  if (!auth.isAuth) {
    throw error;
  }
  return (
    <div className="h-100 w-100 overview p-3 gap-3 d-flex flex-col">
      <div className="w-100 h-100 ">
        <div
          style={{ height: "28%", paddingBottom: "1rem" }}
          className=" position-relative"
        >
          <div
            className="w-80 h-100 rounded-3 p-3 playing e-card"
            style={{
              boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
          <div
            className="position-absolute"
            style={{ bottom: "2rem", left: "1.5rem", color: "white" }}
          >
            <div
              className=" d-flex flex-row align-items-center"
              style={{ height: "1.6rem", gap: "4px" }}
            >
              <img
                src={logo}
                style={{ height: "1.6rem", width: "1.6rem", margin: 0 }}
              />
              <p style={{ fontSize: "1.5rem", fontWeight: "640", margin: 0 }}>
                Private Medica Clinic
              </p>
            </div>
            <p style={{ fontSize: "1rem", margin: 0 }}>
              Chăm sóc sức khỏe toàn diện
            </p>
          </div>
        </div>
        <div style={{ height: "39%", paddingBottom: "1rem" }}>
          <div
            className="d-flex h-100"
            style={{
              boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
            }}
          >
            <MyProvider>
              <PatientOfDay />
            </MyProvider>
            <NumberOfPatient />
          </div>
        </div>
        <div
          style={{
            height: "33%",
          }}
        >
          <TopDrug />
        </div>
      </div>
      <MyProvider>
        <CalendarSelectDay />
      </MyProvider>
    </div>
  );
}

export default HomePage;
