import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

interface Props {

    loading: boolean;

    error: string | null;

    empty: boolean;

    onRetry?(): void;

}

export function PlanningState({

    loading,

    error,

    empty,

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