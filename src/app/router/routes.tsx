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

import SeasonsPage
  from "@/features/administration/pages/SeasonsPage";

import VenuesPage
  from "@/features/administration/pages/VenuesPage";

import UsersPage
  from "@/features/administration/pages/UsersPage";

import CompetitionsPage
  from "@/features/administration/pages/CompetitionsPage";

import PoolsPage
  from "@/features/administration/pages/PoolsPage";

import RegistrationsPage
  from "@/features/administration/pages/RegistrationsPage";

import MatchDaysPage
  from "@/features/administration/pages/MatchDaysPage";

import MatchesPage
  from "@/features/administration/pages/MatchesPage";

import ImportSeasonPage
  from "@/features/administration/pages/ImportSeasonPage";

import ExportSeasonPage
  from "@/features/administration/pages/ExportSeasonPage";

import VenueSettingsPage
  from "@/features/venue-settings/pages/VenueSettingsPage";

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
    path: "/administration",
    element: (
      <ProtectedRoute>
        <AdministrationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration/seasons",
    element: (
      <ProtectedRoute>
        <SeasonsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration/venues",
    element: (
      <ProtectedRoute>
        <VenuesPage />
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
    path: "/administration/competitions",
    element: (
      <ProtectedRoute>
        <CompetitionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration/pools",
    element: (
      <ProtectedRoute>
        <PoolsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration/registrations",
    element: (
      <ProtectedRoute>
        <RegistrationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration/match-days",
    element: (
      <ProtectedRoute>
        <MatchDaysPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration/matches",
    element: (
      <ProtectedRoute>
        <MatchesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration/import",
    element: (
      <ProtectedRoute>
        <ImportSeasonPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/administration/export",
    element: (
      <ProtectedRoute>
        <ExportSeasonPage />
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
];