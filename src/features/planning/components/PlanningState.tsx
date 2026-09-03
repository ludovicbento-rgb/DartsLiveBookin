import {
    Alert,
    AlertTitle,
    Box,
    Button,
} from "@mui/material";

import {
    PlanningSkeleton,
} from "./PlanningSkeleton";

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

        return <PlanningSkeleton />;

    }

    if (error) {

        return (

            <Alert
                severity="error"
            >

                <AlertTitle>

                    Impossible de charger le planning

                </AlertTitle>

                {error}

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

            <Alert
                severity="info"
            >

                <AlertTitle>

                    Aucun créneau disponible

                </AlertTitle>

                Aucun planning n'est disponible
                pour cette journée.

            </Alert>

        );

    }

    return null;

}

export default PlanningState;