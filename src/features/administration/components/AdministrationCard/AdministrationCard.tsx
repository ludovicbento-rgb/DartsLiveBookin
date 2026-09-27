import {
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import ArrowForwardIosIcon
    from "@mui/icons-material/ArrowForwardIos";

import type {
    ReactNode,
} from "react";

interface Props {

    title: string;

    description: string;

    icon: ReactNode;

    enabled: boolean;

    onClick(): void;

}

export function AdministrationCard({

    title,

    description,

    icon,

    enabled,

    onClick,

}: Props) {

    return (

        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,

                opacity:
                    enabled
                        ? 1
                        : 0.65,
            }}
        >

            <CardActionArea

                disabled={
                    !enabled
                }

                onClick={
                    onClick
                }

            >

                <CardContent>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems:
                                "center",
                        }}
                    >

                        <Stack
                            sx={{
                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                minWidth:
                                    42,
                            }}
                        >

                            {icon}

                        </Stack>

                        <Stack
                            spacing={0.5}
                            sx={{
                                flexGrow:
                                    1,
                            }}
                        >

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems:
                                        "center",

                                    flexWrap:
                                        "wrap",
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight:
                                            700,
                                    }}
                                >

                                    {title}

                                </Typography>

                                {
                                    !enabled && (

                                        <Chip
                                            size="small"
                                            label="À venir"
                                        />

                                    )
                                }

                            </Stack>

                            <Typography
                                color="text.secondary"
                            >

                                {description}

                            </Typography>

                        </Stack>

                        {
                            enabled && (

                                <ArrowForwardIosIcon
                                    fontSize="small"
                                    color="action"
                                />

                            )
                        }

                    </Stack>

                </CardContent>

            </CardActionArea>

        </Card>

    );

}

export default AdministrationCard;