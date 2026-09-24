import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

import type {
    AvailabilityDecision,
} from "@/core/availability-engine";

import type {
    VenueClosureReason,
} from "@/entities/venue-closure";

interface Props {

    loading: boolean;

    error: string | null;

    empty: boolean;

    availability?: AvailabilityDecision;

    onRetry?(): void;

}

function getClosureTitle(
    reasonType: VenueClosureReason,
): string {

    switch (reasonType) {

        case "VACATION":
            return "🏖️ Vacances";

        case "PRIVATE_EVENT":
            return "🎉 Privatisation";

        case "MAINTENANCE":
            return "🔧 Maintenance";

        case "INVENTORY":
            return "📦 Inventaire";

        case "OTHER":
            return "🔒 Fermeture exceptionnelle";

    }

}

export function PlanningState({

    loading,

    error,

    empty,

    availability,

    onRetry,

}: Props) {



    if (loading) {

        return (

            <Stack spacing={3}>

                <Skeleton
                    variant="rounded"
                    height={120}
                />

                <Skeleton
                    variant="rounded"
                    height={420}
                />

            </Stack>

        );

    }

    if (error) {

        return (

            <Alert severity="error">

                <AlertTitle>

                    Impossible de charger le planning

                </AlertTitle>

                <Typography>

                    {error}

                </Typography>

                {

                    onRetry && (

                        <Box
                            sx={{
                                mt: 2,
                            }}
                        >

                            <Button
                                variant="contained"
                                onClick={onRetry}
                            >

                                Réessayer

                            </Button>

                        </Box>

                    )

                }

            </Alert>

        );

    }

    if (
        availability?.reason === "CLOSURE"
        &&
        availability.closure
    ) {

        const closure =
            availability.closure;

        return (

            <Alert severity="warning">

                <AlertTitle>

                    {getClosureTitle(
                        closure.reasonType,
                    )}

                </AlertTitle>

                {
                    closure.comment

                        ? closure.comment

                        : "L'établissement est exceptionnellement fermé pour cette journée."
                }

            </Alert>

        );

    }

    if (empty) {

        return (

            <Alert severity="info">

                <AlertTitle>

                    Aucun créneau disponible

                </AlertTitle>

                Aucun créneau n'est disponible pour cette journée.

            </Alert>

        );

    }

    return null;

}

export default PlanningState;