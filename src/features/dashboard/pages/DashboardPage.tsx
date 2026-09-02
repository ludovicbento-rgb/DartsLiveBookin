import Stack from "@mui/material/Stack";

import { useNavigate } from "react-router-dom";

import {
    HOME_ROUTE,
    MY_MATCHES_ROUTE,
    VENUE_SETTINGS_ROUTE,
} from "@/shared/routing";

import SportsScoreIcon
    from "@mui/icons-material/SportsScore";

import StorefrontIcon from "@mui/icons-material/Storefront";

import AssignmentTurnedInIcon
    from "@mui/icons-material/AssignmentTurnedIn";

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

import AdminPanelSettingsIcon
    from "@mui/icons-material/AdminPanelSettings";

import {
    DashboardActionCard,
} from "@/widgets/dashboard/DashboardActionCard";

import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard } from "@/shared/ui";

import { DashboardHeader } from "@/widgets/dashboard/DashboardHeader";

import { useDashboard } from "../hooks/useDashboard";

import { useAuth } from "@/features/authentication/hooks/useAuth";
import { useCurrentUser } from "@/features/authentication/hooks/useCurrentUser";



export function DashboardPage() {
    // -------------------------
    // Hooks
    // -------------------------

    const navigate = useNavigate();

    const {
        dashboard,
        loading,
        error,
    } = useDashboard();

    const profile = useCurrentUser();

    const { logout } = useAuth();

    // -------------------------
    // Guards
    // -------------------------

    if (loading) {

        return (
            <AppLayout>
                <AppCard>
                    Chargement...
                </AppCard>
            </AppLayout>
        );

    }

    if (error) {

        return (
            <AppLayout>
                <AppCard>
                    {error}
                </AppCard>
            </AppLayout>
        );

    }

    if (!dashboard || !profile) {

        return (
            <AppLayout>
                <AppCard>
                    Chargement...
                </AppCard>
            </AppLayout>
        );

    }
    // -------------------------
    // Derived values
    // -------------------------

    const userRole =
        profile.roles?.administrator
            ? "Administrateur"
            : profile.roles?.manager
                ? "Gérant"
                : "Joueur";

    // -------------------------
    // Callbacks
    // -------------------------

    async function handleLogout() {
        await logout();

        navigate(HOME_ROUTE);
    }

    // -------------------------
    // Render
    // -------------------------

    return (
        <AppLayout>
            <Stack spacing={2} sx={{
                width: "100%",
                maxWidth: 700,
                mx: "auto",
            }}>
                <DashboardHeader
                    firstname={profile.firstname}
                    role={userRole}
                    season={
                        dashboard.activeSeason?.name ?? ""
                    }
                    onLogout={handleLogout}
                />

                <Stack spacing={2}>

                    {

                        profile.roles.player && (

                            <DashboardActionCard

                                title="Mes matchs"

                                description="Consulter vos rencontres"

                                icon={<SportsScoreIcon />}

                                color="primary"

                                onClick={() => navigate(MY_MATCHES_ROUTE)}

                            />

                        )

                    }

                    {

                        profile.roles.manager && (

                            <DashboardActionCard

                                title="Demandes"

                                description="Valider les réservations"

                                icon={
                                    <AssignmentTurnedInIcon />
                                }

                                color="warning"

                                onClick={() =>
                                    navigate("/reservation-validation")
                                }

                            />

                        )

                    }

                    {

                        profile.roles.manager && (

                            <DashboardActionCard

                                title="Agenda"

                                description="Consulter les réservations"

                                icon={<CalendarMonthIcon />}

                                color="success"

                                onClick={() =>
                                    navigate("/agenda")
                                }

                            />

                        )

                    }

                    {
                        profile.roles.manager && (

                            <DashboardActionCard

                                title="Mon établissement"

                                description="Gérer les horaires et les fermetures"

                                icon={<StorefrontIcon />}

                                color="success"

                                onClick={() =>
                                    navigate(
                                        VENUE_SETTINGS_ROUTE,
                                    )
                                }

                            />

                        )
                    }

                    {

                        profile.roles.administrator && (

                            <DashboardActionCard

                                title="Administration"

                                description="Paramétrage"

                                icon={
                                    <AdminPanelSettingsIcon />
                                }

                                color="primary"

                                onClick={() =>
                                    navigate("/admin")
                                }

                            />

                        )

                    }

                </Stack>
            </Stack>
        </AppLayout>
    );
}

export default DashboardPage;