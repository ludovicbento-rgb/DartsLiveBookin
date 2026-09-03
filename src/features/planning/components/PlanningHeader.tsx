import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type {
    VenuePlanning,
} from "../model/planning.types";
import type {
    VenueStatus,
} from "@/entities/venue/venue-status";

interface Props {

    planning: VenuePlanning;

    logo: string;

    venueStatus: VenueStatus;

}

export function PlanningHeader({

    planning,
    logo,
    venueStatus,

}: Props) {

    return (

        <Card variant="outlined">

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <Avatar

                            src={`/images/venues/${logo}`}

                            alt={planning.venueName}

                            variant="rounded"

                            sx={{

                                width: 56,

                                height: 56,

                            }}

                        />

                        <Stack spacing={0.5}>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >

                                {planning.venueName}

                            </Typography>

                            <Typography
                                variant="body2"
                                color={
                                    venueStatus.type === "OPEN"

                                        ? "success.main"

                                        : venueStatus.type === "CLOSED"

                                            ? "error.main"

                                            : "warning.main"
                                }
                                sx={{
                                    fontWeight: 700,
                                }}
                            >

                                {

                                    venueStatus.type === "OPEN"

                                        ? "🟢"

                                        : venueStatus.type === "CLOSED"

                                            ? "🔴"

                                            : "🟠"

                                }

                                {" "}

                                {venueStatus.title}

                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >

                                {venueStatus.message}

                            </Typography>

                        </Stack>

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default PlanningHeader;