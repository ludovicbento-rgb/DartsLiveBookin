import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AppLayout } from "@/app/layouts/AppLayout";
import { PageTitle } from "@/shared/ui";

import { useDashboard } from "../hooks/useDashboard";
import { VenueCard } from "@/widgets/dashboard/VenueCard/VenueCard";

import { useNavigate } from "react-router-dom";

export function DashboardPage() {
    const dashboard = useDashboard();
    const navigate = useNavigate();
    return (
        <AppLayout>
            <Stack spacing={4}>
                <PageTitle>
                    Bonjour {dashboard.firstname} 👋
                </PageTitle>

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
                        onPlanning={() => {
                            navigate("/planning", {
                                state: {
                                    venue,
                                },
                            })
                        }}
                    />
                ))}
            </Stack>
        </AppLayout>
    );
}

export default DashboardPage;