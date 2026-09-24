import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import type {
    VenueClosure,
    VenueClosureReason,
} from "@/entities/venue-closure";

interface Props {

    closure: VenueClosure;

}

function getReasonLabel(
    reason: VenueClosureReason,
): string {

    switch (reason) {

        case "VACATION":
            return "Vacances";

        case "PRIVATE_EVENT":
            return "Privatisation";

        case "MAINTENANCE":
            return "Maintenance";

        case "INVENTORY":
            return "Inventaire";

        case "OTHER":
            return "Fermeture exceptionnelle";

    }

}

function getReasonIcon(
    reason: VenueClosureReason,
): string {

    switch (reason) {

        case "VACATION":
            return "🏖️";

        case "PRIVATE_EVENT":
            return "🎉";

        case "MAINTENANCE":
            return "🔧";

        case "INVENTORY":
            return "📦";

        case "OTHER":
            return "🔒";

    }

}

function formatDate(
    date: Date,
): string {

    return date.toLocaleDateString(
        "fr-FR",
    );

}

export function VenueClosureCard({

    closure,

}: Props) {

    const startDate =
        closure.startDate.toDate();

    const endDate =
        closure.endDate.toDate();

    return (

        <Card variant="outlined">

            <CardContent>

                <Stack spacing={1.5}>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent:
                                "space-between",
                            alignItems:
                                "flex-start",
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                            }}
                        >

                            {getReasonIcon(
                                closure.reasonType,
                            )}

                            {" "}

                            {getReasonLabel(
                                closure.reasonType,
                            )}

                        </Typography>

                        <Chip
                            size="small"
                            color={
                                closure.active
                                    ? "success"
                                    : "default"
                            }
                            label={
                                closure.active
                                    ? "Actif"
                                    : "Inactif"
                            }
                        />

                    </Stack>

                    <Typography
                        variant="body2"
                    >

                        📆 Du {formatDate(startDate)}
                        {" au "}
                        {formatDate(endDate)}

                    </Typography>

                    {
                        closure.comment && (

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >

                                {closure.comment}

                            </Typography>

                        )
                    }

                </Stack>

            </CardContent>

        </Card>

    );

}

export default VenueClosureCard;