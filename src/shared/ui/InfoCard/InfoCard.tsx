import {
    Card,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";

import type {
    ChipProps,
} from "@mui/material";

interface Props {

    title: string;

    value: string;

    color?: ChipProps["color"];

}

export function InfoCard({

    title,

    value,

    color = "primary",

}: Props) {

    return (

        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
            }}
        >

            <CardContent

                sx={{

                    py: 1.25,

                    "&:last-child": {

                        pb: 1.25,

                    }

                }}

            >

                <Chip

                    label={title}

                    color={color}

                    size="small"

                    sx={{
                        mb: 2,
                    }}

                />

                <Typography

                    variant="body1"

                    sx={{

                        mt: 0.5,

                        fontWeight: 600,

                    }}

                >

                    {value}

                </Typography>

            </CardContent>

        </Card>

    );

}