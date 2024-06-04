import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoginPage from "./pages/auth/Login";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import ReportsPage from "./pages/Reports";
import PatientsPage from "./pages/patients/Patients";
import ExaminationsPage from "./pages/settings/examination/Examinations";
import UsersView from "./pages/settings/users/Users";
import PrincipleView from "./pages/settings/Principle";
import PasswordView from "./pages/settings/Password";
import MedicineView from "./pages/settings/Medicine";
import DrugTab from "./pages/settings/medicines/Drugs";
import UnitsTab from "./pages/settings/medicines/Units";
import UsagesTab from "./pages/settings/medicines/Usages";
import DiseasesTab from "./pages/settings/medicines/Diseases";
import PatientDetail from "./pages/patients/PatientDetail";
import ExaminationDetail from "./pages/settings/examination/ExaminationDetail";
import PreScriptionTab from "./pages/settings/examination/PrescriptionTab";
import HistoryTab from "./pages/settings/examination/HistoryTab";
import Invoice from "./pages/Invoice/Invoice";
import ErrorPage from "./pages/Error";
import ForgotPassword from "./pages/auth/ForgotPassword";
import RoleDetail from "./pages/settings/users/RoleDetail";
import RoleTab from "./pages/settings/users/RoleTab";
import MemberTab from "./pages/settings/users/MemberTab";
import LoginSuccess from "./pages/auth/LoginSuccess";
import useAuth from "./hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { fetchGroupById } from "./services/group";
import { fetchUserById } from "./services/users";
import { elements } from "chart.js";
import BookingPage from "./pages/booking/Booking";

const allRouter = [
  {
    path: "/",
    children: [
      { index: true, element: <LoginPage />, isPrivate: false },
      { path: "/success", element: <LoginSuccess />, isPrivate: false },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
        isPrivate: false,
      },
      {
        element: <RootLayout />,
        isPrivate: true,
        children: [
          { path: "/home", element: <HomePage />, isPrivate: true },
          { path: "/password", element: <PasswordView />, isPrivate: true },

          {
            path: "/principle",
            element: <PrincipleView />,
            isPrivate: true,
            permission: "RArgument",
          },
          {
            path: "/invoice",
            element: <Invoice />,
            isPrivate: true,
            permission: "RInvoice",
          },
          {
            path: "/reports",
            element: <ReportsPage />,
            isPrivate: true,
            permission: "RReport",
          },
          {
            path: "/patients",
            element: <PatientsPage />,
            isPrivate: true,
            permission: "RPatient",
          },
          {
            path: "/patients/:patientId",
            element: <PatientDetail />,
            isPrivate: true,
            permission: "RPatient",
          },
          {
            path: "/examinations",
            element: <ExaminationsPage />,
            isPrivate: true,
            permission: "RAppointment",
          },
          {
            path:"/booking",
            element:<BookingPage/>,
            isPrivate: true,
            permission:"RBookingAppointment"
          },
          {
            path: "/examinations/:appopintmentListPatientId",
            element: <ExaminationDetail />,
            isPrivate: true,
            permission: "CRecord",
            children: [
              {
                path: "prescription",
                element: <PreScriptionTab isEditable={true} />,
                isPrivate: true,
                permission: "RDrug",
              },
              {
                path: "examhistory",
                element: <HistoryTab />,
                isPrivate: true,
                permission: "RRecord",
              },
            ],
          },
          {
            path: "/users",
            element: <UsersView />,
            isPrivate: true,
            permission: "RUser",
            children: [
              {
                path: "members",
                element: <MemberTab />,
                isPrivate: true,
                permission: "RUser",
              },
              {
                path: "roles",
                element: <RoleTab />,
                isPrivate: true,
                permission: "RUser",
              },
              {
                path: "roles/new",
                element: <RoleDetail />,
                isPrivate: true,
                permission: "RUser",
              },
              {
                path: "roles/:roleId",
                element: <RoleDetail />,
                isPrivate: true,
                permission: "RUser",
              },
            ],
          },
          {
            path: "/medicine",
            element: <MedicineView />,
            isPrivate: true,
            permission: "RDrug",
            children: [
              {
                path: "drugs",
                element: <DrugTab />,
                isPrivate: true,
                permission: "RDrug",
              },
              {
                path: "units",
                element: <UnitsTab />,
                isPrivate: true,
                permission: "RDrug",
              },
              {
                path: "usages",
                element: <UsagesTab />,
                isPrivate: true,
                permission: "RDrug",
              },
              {
                path: "diseases",
                element: <DiseasesTab />,
                isPrivate: true,
                permission: "RDrug",
              },
            ],
          },
        ],
      },
    ],
    errorElement: <ErrorPage />,
  },
];

function App() {
  const { setAuth } = useAuth();
  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const jwtToken = Cookies.get("refreshToken");
      if (jwtToken !== undefined) {
        const userData = jwtDecode(jwtToken);
        let authorizeData = [];
        let isAuth = false;
        const user = await fetchUserById({ id: userData.id });
        if (user.isActive == 1) {
          const group = await fetchGroupById({ id: userData.roleId });
          if (group.groupUser.isActive == 1) {
            authorizeData = group.allowedPermissionElements;
          }

          isAuth =
            group.groupUser && group.groupUser.isActive == 1 ? true : false;
        }

        setAuth({
          roleId: userData.roleId,
          permission: authorizeData,
          isAuth: isAuth,
          isPending: false,
        });
        return {
          roleId: userData.roleId,
          permission: authorizeData,
          isAuth: isAuth,
        };
      } else {
        setAuth({
          roleId: null,
          permission: null,
          isAuth: false,
          isPending: false,
        });
        return {
          roleId: null,
          permission: null,
          isAuth: false,
        };
      }
    },
  });

  const router = createBrowserRouter(allRouter);

  return <RouterProvider router={router} />;
}

export default App;
