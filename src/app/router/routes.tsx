import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/features/authentication/pages/LoginPage";
import { MaintenancePage } from "@/pages/maintenance/MaintenancePage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { PlanningPage } from "@/features/planning/pages/PlanningPage";
import { MyMatchesPage } from "@/features/matches/pages/MyMatchesPage";
import { ProtectedRoute } from "@/features/authentication/routes/ProtectedRoute";
import { ActivateAccountPage } from "@/features/authentication/pages/ActivateAccountPage";
import { ReservationValidationPage }
  from "@/features/reservation-validation/pages/ReservationValidationPage";
import AgendaPage
  from "@/features/agenda/pages/AgendaPage";

import AdministrationPage
  from "@/features/administration/pages/AdministrationPage";
import UsersPage
  from "@/features/administration/users/pages/UsersPage";

import VenueSettingsPage
  from "@/features/venue-settings/pages/VenueSettingsPage";

import AvailabilityRulesPage
  from "@/features/availability-rules/pages/AvailabilityRulePage";

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
  {
    path: "/reservation-validation",
    element: (
      <ProtectedRoute>
        <ReservationValidationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/agenda",
    element: (
      <ProtectedRoute>
        <AgendaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration",
    element: (
      <ProtectedRoute>
        <AdministrationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration/users",
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/venue-settings",
    element: (
      <ProtectedRoute>
        <VenueSettingsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/venue-settings/:venueId/availability-rules",
    element: (
      <AvailabilityRulesPage />
    ),
  },
];