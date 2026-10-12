import {
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import AddIcon
    from "@mui/icons-material/Add";

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

import {
    VenueScheduleRow,
} from "./VenueScheduleRow";

import {
    WEEK_DAYS,
} from "@/shared/constants/week-days";

interface Props {

    dayOfWeek: number;

    schedules: VenueSchedule[];

    onAdd(
        dayOfWeek: number,
    ): void;

    onEdit(
        schedule: VenueSchedule,
    ): void;

    onDelete(
        schedule: VenueSchedule,
    ): void;

}

export function VenueScheduleCard({

    dayOfWeek,

    schedules,

    onAdd,

    onEdit,

    onDelete,

}: Props) {

    return (

        <Card
            variant="outlined"
        >

            <CardContent>

                <Stack spacing={2}>

                    {/*
                     * ------------------------------------------------
                     * En-tête de la journée
                     * ------------------------------------------------
                     */}

                    <Stack
                        direction="row"
                        sx={{
                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                alignItems:
                                    "center",
                            }}
                        >

                            <CalendarMonthIcon
                                fontSize="small"
                                color="primary"
                            />

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight:
                                        700,
                                }}
                            >

                                {
                                    WEEK_DAYS[
                                    dayOfWeek
                                    ]
                                }

                            </Typography>

                        </Stack>

                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight:
                                    600,

                                color:
                                    schedules.length === 0
                                        ? "text.disabled"
                                        : "primary.main",
                            }}
                        >

                            {
                                schedules.length === 0
                                    ? "Fermé"
                                    : `${schedules.length} plage${schedules.length > 1 ? "s" : ""}`
                            }

                        </Typography>

                    </Stack>


                    {/*
                     * ------------------------------------------------
                     * Journée sans plage d'ouverture
                     * ------------------------------------------------
                     */}

                    {
                        schedules.length === 0 && (

                            <Typography
                                sx={{
                                    fontStyle:
                                        "italic",

                                    color:
                                        "text.disabled",
                                }}
                            >

                                Aucun horaire configuré

                            </Typography>

                        )
                    }


                    {/*
                     * ------------------------------------------------
                     * Plages d'ouverture
                     * ------------------------------------------------
                     */}

                    {
                        schedules.map(
                            schedule => {

                                /*
                                 * Génération des créneaux joueurs
                                 * uniquement pour cette plage.
                                 *
                                 * buildReservationSlots()
                                 * retourne directement :
                                 *
                                 * ReservationSlot[]
                                 */

                                return (

                                    <Stack
                                        key={
                                            schedule.id
                                        }
                                        spacing={2}
                                    >

                                        {/*
                                         * Ligne principale :
                                         *
                                         * 18:00 → 23:30
                                         * Cible 1
                                         * Edit / Delete
                                         */}

                                        <VenueScheduleRow

                                            schedule={
                                                schedule
                                            }

                                            onEdit={
                                                onEdit
                                            }

                                            onDelete={
                                                onDelete
                                            }

                                        />

                                    </Stack>

                                );

                            },
                        )
                    }


                    {/*
                     * ------------------------------------------------
                     * Ajout d'une nouvelle plage
                     * ------------------------------------------------
                     */}

                    <Divider />

                    <Button
                        startIcon={
                            <AddIcon />
                        }
                        variant="contained"
                        onClick={() =>
                            onAdd(
                                dayOfWeek,
                            )
                        }
                    >

                        {
                            schedules.length === 0
                                ? "Créer une plage d'ouverture"
                                : "Ajouter une plage d'ouverture"
                        }

                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

}