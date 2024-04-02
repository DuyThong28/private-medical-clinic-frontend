import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import LoginPage from "./pages/Login";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import ReportsPage from "./pages/Reports";
import PatientsPage from "./pages/Patients";
import ExaminationsPage from "./pages/Examinations";
import UsersView from "./pages/settings/Users";
import PrincipleView from "./pages/settings/Principle";
import PasswordView from "./pages/settings/Password";
import MedicineView from "./pages/settings/Medicine";
import DrugTab from "./pages/settings/Drugs";
import UnitsTab from "./pages/settings/Units";
import UsagesTab from "./pages/settings/Usages";
import DiseasesTab from "./pages/settings/Diseases";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/systems",
    element: <RootLayout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      { path: "reports", element: <ReportsPage /> },
      { path: "patients", element: <PatientsPage /> },
      { path: "examinations", element: <ExaminationsPage /> },
      {
        path: "settings",
        children: [
          { path: "users", element: <UsersView /> },
          { path: "principle", element: <PrincipleView /> },
          {path:'medicine', element: <MedicineView/>, children: [
            {path: 'drugs', element: <DrugTab/>},
            {path: 'units', element:<UnitsTab/>},
            {path: 'usages', element:<UsagesTab/>},
            {path:'diseases', element:<DiseasesTab/>}
          ]},
          { path: "password", element: <PasswordView /> },
        ],
      },
    ],
  },
]);

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
