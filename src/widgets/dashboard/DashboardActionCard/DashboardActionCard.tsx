import {
    Card,
    CardActionArea,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";

import type {
    ReactNode,
} from "react";

interface Props {

    title: string;

    description: string;

    icon: ReactNode;

    color:
    | "primary"
    | "success"
    | "warning";

    onClick(): void;

}

export function DashboardActionCard({

    title,

    description,

    icon,

    onClick,

}: Props) {

    return (

        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
            }}
        >

            <CardActionArea
                onClick={onClick}
            >

                <CardContent>

                    <Stack
                        spacing={2}
                    >

                        <Stack
                            direction="row"
                            sx={{
                                alignItems: "center",
                                gap: 2,
                            }}
                        >

                            {icon}

                            <Typography
                                variant="h6"
                            >

                                {title}

                            </Typography>

                        </Stack>

                        <Typography
                            color="text.secondary"
                        >

                            {description}

                        </Typography>

                    </Stack>

                </CardContent>

            </CardActionArea>

        </Card>

    );

} export default DashboardActionCard;               