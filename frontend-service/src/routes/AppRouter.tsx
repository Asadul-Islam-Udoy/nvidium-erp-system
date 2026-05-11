import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "sign-in",
        element: <LoginPage />,
      },
      {
        path: "sign-up",
        element: <RegisterPage />,
      },
    ],
  },
]);