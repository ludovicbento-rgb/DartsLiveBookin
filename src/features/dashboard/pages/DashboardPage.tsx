import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";

import { AppLayout } from "@/app/layouts/AppLayout";

import { DashboardHeader } from "@/widgets/dashboard/DashboardHeader";
import { VenueCard } from "@/widgets/dashboard/VenueCard/VenueCard";

import { useDashboard } from "../hooks/useDashboard";

import { useCurrentUser } from "@/features/authentication/hooks/useCurrentUser";
import { useAuth } from "@/features/authentication/hooks/useAuth";

export function DashboardPage() {

    // -------------------------
    // Hooks
    // -------------------------

    const navigate = useNavigate();

    const dashboard = useDashboard();

    const profile = useCurrentUser();

    const { logout } = useAuth();

    // -------------------------
    // Guards
    // -------------------------

    if (!profile) {
        return null;
    }

    // -------------------------
    // Callbacks
    // -------------------------

    async function handleLogout() {

        await logout();

        navigate("/");

    }

    // -------------------------
    // Render
    // -------------------------

    return (

        <AppLayout>

            <Stack spacing={4}>

                <DashboardHeader

                    firstname={profile.firstname}

                    lastname={profile.lastname}

                    role={
                        profile.roles.administrator
                            ? "Administrateur"
                            : profile.roles.manager
                                ? "Gérant"
                                : "Joueur"
                    }

                    season={profile.seasonId}

                    onLogout={handleLogout}

                />

                <Typography
                    color="text.secondary"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    Championnat de France Dartslive
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    Saison {dashboard.season}
                </Typography>

                {dashboard.venues.map((venue) => (

                    <VenueCard

                        key={venue.id}

                        name={venue.name}

                        boardCount={venue.boardCount}

                        availableSlots={venue.availableSlots}

                        onPlanning={() =>

                            navigate(
                                `/planning/${venue.id}`,
                            )

                        }

                    />

                ))}

            </Stack>

        </AppLayout>

    );

}

export default DashboardPage;