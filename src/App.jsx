import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import LoginPage from "./pages/Login";
import SettingPage from "./pages/Setting";

const router = createBrowserRouter([{ path: "/login", element: <LoginPage /> }
,{
  path: '/setting', element: <SettingPage/>
}]);

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
