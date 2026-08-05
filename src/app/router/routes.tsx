import { HomePage } from "../../pages/home/HomePage";
import { LoginPage } from "@/features/authentication/pages/LoginPage";
import { MaintenancePage } from "../../pages/maintenance/MaintenancePage";
import { NotFoundPage } from "../../pages/not-found/NotFoundPage";
import { RegisterPage } from "../../pages/register/RegisterPage";

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/maintenance",
    element: <MaintenancePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];