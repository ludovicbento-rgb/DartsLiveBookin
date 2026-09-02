import {
    useState,
} from "react";

import {
    Fragment,
} from "react";

import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import { AppLayout } from "@/app/layouts/AppLayout";

import {
    AppCard,
} from "@/shared/ui";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

import {
    useVenueSchedules,
} from "../hooks/useVenueSchedules";

import {
    VenueScheduleCard,
} from "../components/VenueScheduleCard";

import {
    VenueScheduleDrawer,
} from "../components/VenueScheduleDrawer";

import {
    GeneratedPlanningCard,
} from "@/features/planning/components/GeneratedPlanning";

import {
    useVenueScheduleEditor,
} from "../hooks/useVenueScheduleEditor";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    useManagedVenue,
} from "../hooks/useManagedVenue";

import type {
    PlanningBoard,
} from "@/core/reservation-engine";

export function VenueSettingsPage() {

    const profile =
        useCurrentUser();

    const {

        venue,

        loading: loadingVenue,

    } = useManagedVenue(

        profile?.id ?? "",

    );

    const {

        schedules,

        loading,

    } =
        useVenueSchedules(
            venue?.id ?? "",

        );

    const [

        drawerOpen,

        setDrawerOpen,

    ] = useState(false);

    const [

        selectedDay,

        setSelectedDay,

    ] = useState(1);

    const [

        selectedSchedule,

        setSelectedSchedule,

    ] = useState<VenueSchedule | null>(
        null,
    );

    const [

        startTime,

        setStartTime,

    ] = useState("");

    const [

        endTime,

        setEndTime,

    ] = useState("");

    const [

        boardNumbers,

        setBoardNumbers,

    ] = useState<number[]>([]);

    const editor =
        useVenueScheduleEditor();

    const generatedPlanning: PlanningBoard[] = [];

    if (loadingVenue) {

        return (

            <AppLayout>

                <AppCard>

                    Chargement...

                </AppCard>

            </AppLayout>

        );

    }



    function handleAdd(
        dayOfWeek: number,
    ) {

        setSelectedSchedule(
            null,
        );

        setSelectedDay(
            dayOfWeek,
        );

        setStartTime("");

        setEndTime("");

        setBoardNumbers([]);

        setDrawerOpen(true);

    }

    function handleEdit(
        schedule: VenueSchedule,
    ) {

        setSelectedSchedule(
            schedule,
        );

        setSelectedDay(
            schedule.dayOfWeek,
        );

        setStartTime(
            schedule.startTime,
        );

        setEndTime(
            schedule.endTime,
        );

        setBoardNumbers(
            schedule.boardNumbers,
        );

        setDrawerOpen(true);

    }

    async function handleDelete(
        schedule: VenueSchedule,
    ) {

        await editor.remove(
            schedule.id,
        );

    }

    async function handleSave() {

        if (selectedSchedule) {

            await editor.update({

                ...selectedSchedule,

                startTime,

                endTime,

                boardNumbers,

            });

        }
        else {

            await editor.create({

                venueId:
                    venue!.id,

                dayOfWeek:
                    selectedDay,

                startTime,

                endTime,

                boardNumbers,

                active: true,

            });

        }

        setDrawerOpen(false);

    }

    if (loading) {

        return (

            <AppLayout>

                <AppCard>

                    <CircularProgress />

                </AppCard>

            </AppLayout>

        );

    }

    const schedulesByDay =

        Array.from(

            {
                length: 7,
            },

            (_, index) => ({

                dayOfWeek:
                    index + 1,

                schedules:

                    schedules.filter(

                        schedule =>

                            schedule.dayOfWeek ===
                            index + 1,

                    ),

            }),

        );

    return (

        <AppLayout>

            <AppCard>

                <Stack spacing={2}>

                    {
                        venue && (

                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    alignItems: "center",
                                    mb: 3,
                                }}
                            >

                                <Box
                                    component="img"
                                    src={`/images/venues/${venue.logo}`}
                                    alt={venue.name}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        objectFit: "contain",
                                    }}
                                />

                                <Stack>

                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    >

                                        {venue.name}

                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >

                                        Horaires hebdomadaires

                                    </Typography>

                                </Stack>

                            </Stack>

                        )
                    }

                    {

                        schedulesByDay.map(

                            day => (
                                <Fragment
                                    key={day.dayOfWeek}
                                >
                                    <VenueScheduleCard

                                        dayOfWeek={day.dayOfWeek}

                                        schedules={day.schedules}

                                        generatedPlanning={

                                            generatedPlanning.filter(

                                                board =>

                                                    day.schedules.some(

                                                        schedule =>

                                                            schedule.boardNumbers.includes(

                                                                board.boardNumber,

                                                            ),

                                                    ),

                                            )

                                        }

                                        onAdd={handleAdd}

                                        onEdit={handleEdit}

                                        onDelete={handleDelete}

                                    />

                                    <GeneratedPlanningCard

                                        planning={

                                            generatedPlanning.filter(

                                                board =>

                                                    day.schedules.some(

                                                        schedule =>

                                                            schedule.boardNumbers.includes(

                                                                board.boardNumber,

                                                            ),

                                                    ),

                                            )

                                        }

                                    />
                                </Fragment>
                            ),

                        )

                    }

                </Stack>

            </AppCard>

            <VenueScheduleDrawer

                open={drawerOpen}

                schedule={selectedSchedule}

                startTime={startTime}

                endTime={endTime}

                boardNumbers={boardNumbers}

                maxBoards={4}

                loading={editor.loading}

                error={editor.error}

                onStartTimeChanged={setStartTime}

                onEndTimeChanged={setEndTime}

                onBoardNumbersChanged={setBoardNumbers}

                onClose={() => setDrawerOpen(false)}

                onSave={handleSave}

            />
        </AppLayout>

    );

}

export default VenueSettingsPage;