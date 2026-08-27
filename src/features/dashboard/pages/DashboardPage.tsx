import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";

import {
    HOME_ROUTE,
    planningRoute,
} from "@/shared/routing";

import { AppLayout } from "@/app/layouts/AppLayout";
import { AppCard } from "@/shared/ui";

import { DashboardHeader } from "@/widgets/dashboard/DashboardHeader";
import { VenueCard } from "@/widgets/dashboard/VenueCard/VenueCard";

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
                    season={profile.seasonId}
                    onLogout={handleLogout}
                />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        textAlign: "center",
                    }}
                >
                    Choisissez un établissement
                </Typography>

                {dashboard.venues.map((venue) => (
                    <VenueCard
                        key={venue.id}
                        name={venue.name}
                        city={venue.city}
                        logo={venue.logo}
                        boardCount={venue.boardCount}
                        onPlanning={() =>
                            navigate(planningRoute(venue.id))
                        }
                    />
                ))}
            </Stack>
        </AppLayout>
    );
}

export default DashboardPage;