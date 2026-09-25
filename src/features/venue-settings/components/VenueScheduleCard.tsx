import {
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import AddIcon
    from "@mui/icons-material/Add";

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

import ExpandMoreIcon
    from "@mui/icons-material/ExpandMore";

import ExpandLessIcon
    from "@mui/icons-material/ExpandLess";

import {
    useState,
} from "react";

import {
    buildReservationSlots,
} from "@/core/reservation-engine";

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

    durationMinutes: number;

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

    durationMinutes,

    onAdd,

    onEdit,

    onDelete,

}: Props) {

    const [
        expandedScheduleId,
        setExpandedScheduleId,
    ] = useState<string | null>(
        null,
    );

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
                                const generatedSlots =
                                    buildReservationSlots(

                                        {
                                            openTime:
                                                schedule.openTime,

                                            closeTime:
                                                schedule.closeTime,

                                            boardNumbers:
                                                schedule.boardNumbers,
                                        },

                                        durationMinutes,

                                    );

                                const expanded =
                                    expandedScheduleId ===
                                    schedule.id;

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


                                        {/*
                                         * Bouton permettant
                                         * d'afficher les créneaux
                                         * générés pour cette plage.
                                         */}

                                        <Button
                                            variant="text"
                                            endIcon={
                                                expanded
                                                    ? <ExpandLessIcon />
                                                    : <ExpandMoreIcon />
                                            }
                                            onClick={() => {

                                                setExpandedScheduleId(

                                                    expanded
                                                        ? null
                                                        : schedule.id,

                                                );

                                            }}
                                        >

                                            {
                                                expanded
                                                    ? "Masquer les créneaux joueurs"
                                                    : "Afficher les créneaux joueurs"
                                            }

                                        </Button>


                                        {/*
                                         * ------------------------------------------------
                                         * Créneaux joueurs
                                         * ------------------------------------------------
                                         */}

                                        <Collapse
                                            in={
                                                expanded
                                            }
                                            unmountOnExit
                                        >

                                            <Stack spacing={2}>

                                                {
                                                    generatedSlots.length === 0
                                                        ? (

                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >

                                                                Aucun créneau joueur généré pour cette plage.

                                                            </Typography>

                                                        )
                                                        : (

                                                            /*
                                                             * On regroupe les créneaux
                                                             * par numéro de cible.
                                                             */
                                                            schedule.boardNumbers.map(
                                                                boardNumber => {

                                                                    const boardSlots =
                                                                        generatedSlots.filter(

                                                                            slot =>
                                                                                slot.boardNumber ===
                                                                                boardNumber,

                                                                        );

                                                                    return (

                                                                        <Stack
                                                                            key={
                                                                                boardNumber
                                                                            }
                                                                            spacing={1}
                                                                        >

                                                                            <Typography
                                                                                variant="body2"
                                                                                sx={{
                                                                                    fontWeight:
                                                                                        700,
                                                                                }}
                                                                            >

                                                                                🎯 Cible {boardNumber}

                                                                            </Typography>


                                                                            {
                                                                                boardSlots.length === 0
                                                                                    ? (

                                                                                        <Typography
                                                                                            variant="body2"
                                                                                            color="text.secondary"
                                                                                        >

                                                                                            Aucun créneau disponible.

                                                                                        </Typography>

                                                                                    )
                                                                                    : (

                                                                                        <Stack
                                                                                            direction="row"
                                                                                            spacing={1}
                                                                                            sx={{
                                                                                                flexWrap:
                                                                                                    "wrap",

                                                                                                gap:
                                                                                                    1,
                                                                                            }}
                                                                                        >

                                                                                            {
                                                                                                boardSlots.map(
                                                                                                    slot => (

                                                                                                        <Chip
                                                                                                            key={
                                                                                                                `${schedule.id}-${slot.boardNumber}-${slot.startTime}`
                                                                                                            }
                                                                                                            size="small"
                                                                                                            color={
                                                                                                                slot.status === "AVAILABLE"
                                                                                                                    ? "success"
                                                                                                                    : slot.status === "RESERVED"
                                                                                                                        ? "error"
                                                                                                                        : "warning"
                                                                                                            }
                                                                                                            variant={
                                                                                                                slot.status === "AVAILABLE"
                                                                                                                    ? "outlined"
                                                                                                                    : "filled"
                                                                                                            }
                                                                                                            label={
                                                                                                                slot.status === "BLOCKED"
                                                                                                                    ? (
                                                                                                                        slot.blockTitle
                                                                                                                        ??
                                                                                                                        "Indisponible"
                                                                                                                    )
                                                                                                                    : `${slot.startTime} → ${slot.endTime}`
                                                                                                            }
                                                                                                        />

                                                                                                    ),
                                                                                                )
                                                                                            }

                                                                                        </Stack>

                                                                                    )
                                                                            }

                                                                        </Stack>

                                                                    );

                                                                },
                                                            )

                                                        )
                                                }

                                            </Stack>

                                        </Collapse>

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