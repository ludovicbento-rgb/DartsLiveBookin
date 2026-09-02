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

import type {
    PlanningBoard,
} from "@/core/reservation-engine";

import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import {
    useState,
} from "react";

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
    generatedPlanning: PlanningBoard[];
    onAdd(dayOfWeek: number,): void;
    onEdit(schedule: VenueSchedule,): void;
    onDelete(schedule: VenueSchedule,): void;
}

export function VenueScheduleCard({
    dayOfWeek,
    schedules,
    generatedPlanning,
    onAdd,
    onEdit,
    onDelete,
}: Props) {

    const [
        expandedScheduleId,
        setExpandedScheduleId,
    ] = useState<string | null>(null);

    return (
        <Card variant="outlined" >
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Stack direction="row"
                            spacing={1}
                            sx={{
                                alignItems: "center",
                            }}
                        >
                            <CalendarMonthIcon fontSize="small" color="primary" />
                            <Typography variant="h6"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {WEEK_DAYS[dayOfWeek]}
                            </Typography>
                        </Stack>
                        <Typography variant="body2"
                            sx={{
                                fontWeight: 600,
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
                    {
                        schedules.length === 0 && (
                            <Typography
                                sx={{
                                    fontStyle: "italic",
                                    color: "text.disabled",
                                }}
                            >
                                Aucun horaire configuré
                            </Typography>
                        )
                    }
                    {
                        schedules.map(schedule => {
                            return (
                                <Stack
                                    key={schedule.id}
                                    spacing={2}
                                >
                                    <VenueScheduleRow
                                        schedule={schedule}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                    <Button
                                        variant="text"
                                        endIcon={
                                            expandedScheduleId === schedule.id
                                                ? <ExpandLessIcon />
                                                : <ExpandMoreIcon />
                                        }
                                        onClick={() =>
                                            setExpandedScheduleId(
                                                expandedScheduleId === schedule.id
                                                    ? null
                                                    : schedule.id,
                                            )
                                        }
                                    >
                                        Afficher les créneaux joueurs
                                    </Button>
                                    <Collapse in={expandedScheduleId === schedule.id}>
                                        <Stack spacing={2}>
                                            {
                                                generatedPlanning.length > 0 && (

                                                    generatedPlanning.map(board => (
                                                        <Stack
                                                            key={board.boardNumber}
                                                            spacing={1}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                🎯 Cible {board.boardNumber}
                                                            </Typography>
                                                            <Stack
                                                                direction="row"
                                                                spacing={1}
                                                                sx={{
                                                                    flexWrap: "wrap",
                                                                    gap: 1,
                                                                }}
                                                            >
                                                                {
                                                                    board.slots.map(slot => (
                                                                        <Chip
                                                                            key={`${slot.boardNumber}-${slot.startTime}`}
                                                                            size="small"
                                                                            color={
                                                                                slot.reserved
                                                                                    ? "error"
                                                                                    : "success"
                                                                            }
                                                                            label={`${slot.startTime} → ${slot.endTime}`}
                                                                        />
                                                                    ))
                                                                }
                                                            </Stack>
                                                        </Stack>
                                                    ))
                                                )
                                            }
                                        </Stack>
                                    </Collapse>
                                </Stack>
                            );
                        })
                    }
                    <Divider />
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={() =>
                            onAdd(dayOfWeek)
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