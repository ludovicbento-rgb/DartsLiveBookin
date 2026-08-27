import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/features/authentication/pages/LoginPage";
import { MaintenancePage } from "@/pages/maintenance/MaintenancePage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { PlanningPage } from "@/features/planning/pages/PlanningPage";
import { MyMatchesPage } from "@/features/matches/pages/MyMatchesPage";
import { ProtectedRoute } from "@/features/authentication/routes/ProtectedRoute";
import { ActivateAccountPage } from "@/features/authentication/pages/ActivateAccountPage";

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
    path: "/maintenance",
    element: <MaintenancePage />,
  },
  {
    path: "/matches",
    element: (
      <ProtectedRoute>
        <MyMatchesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/planning/:venueId",
    element: (
      <ProtectedRoute>
        <PlanningPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/activate",
    element: <ActivateAccountPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];