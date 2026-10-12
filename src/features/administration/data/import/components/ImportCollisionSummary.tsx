import {
    Alert,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import type {
    SeasonImportCollision,
} from "../model/season-import.types";

interface Props {

    collisions:
    SeasonImportCollision[];

}

export function ImportCollisionSummary({

    collisions,

}: Props) {

    if (
        collisions.length === 0
    ) {

        return (

            <Alert severity="success">

                Aucun document existant n'entre en conflit avec cet import.

            </Alert>

        );

    }

    return (

        <Stack spacing={2}>

            <Alert severity="error">

                {collisions.length} document(s) existent déjà dans Firestore.
                L'import est bloqué afin d'éviter tout écrasement.

            </Alert>

            <Stack spacing={1}>

                {
                    collisions.map(
                        collision => (

                            <Stack
                                key={
                                    `${collision.collection}/${collision.id}`
                                }
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems:
                                        "center",

                                    flexWrap:
                                        "wrap",
                                }}
                            >

                                <Chip
                                    size="small"
                                    label={
                                        collision.collection
                                    }
                                />

                                <Typography
                                    variant="body2"
                                >

                                    {collision.id}

                                </Typography>

                            </Stack>

                        ),
                    )
                }

            </Stack>

        </Stack>

    );

}

export default ImportCollisionSummary;