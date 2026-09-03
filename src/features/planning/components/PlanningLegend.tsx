import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

export function PlanningLegend() {

    return (

        <Card
            variant="outlined"
        >

            <CardContent>

                <Stack
                    spacing={2}
                >

                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        Légende

                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            flexWrap: "wrap",
                        }}
                    >

                        <Chip
                            color="success"
                            label="Disponible"
                        />

                        <Chip
                            color="warning"
                            label="En attente"
                        />

                        <Chip
                            color="error"
                            label="Réservé"
                        />

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}

export default PlanningLegend;