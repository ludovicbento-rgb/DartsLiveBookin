import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/features/authentication/pages/LoginPage";
import { MaintenancePage } from "@/pages/maintenance/MaintenancePage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { PlanningPage } from "@/features/planning/pages/PlanningPage";
import { ProtectedRoute } from "@/features/authentication/routes/ProtectedRoute";


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
    path: "*",
    element: <NotFoundPage />,
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
  }
];