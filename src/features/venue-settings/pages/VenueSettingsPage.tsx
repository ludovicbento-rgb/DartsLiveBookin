import {
    useState,
} from "react";

import {
    Fragment,
} from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SettingsIcon
    from "@mui/icons-material/Settings";

import {
    useNavigate,
} from "react-router-dom";

import {
    AppLayout,
} from "@/app/layouts/AppLayout";

import {
    AppCard,
} from "@/shared/ui";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

import {
    availabilityRulesRoute,
} from "@/shared/routing";

import {
    useCurrentUser,
} from "@/features/authentication/hooks/useCurrentUser";

import {
    useVenueSchedules,
} from "../hooks/useVenueSchedules";

import {
    useManagedVenue,
} from "../hooks/useManagedVenue";

import {
    useVenueScheduleEditor,
} from "../hooks/useVenueScheduleEditor";

import {
    VenueScheduleCard,
} from "../components/VenueScheduleCard";

import {
    VenueScheduleDrawer,
} from "../components/VenueScheduleDrawer";

import {
    useConfiguration,
} from "@/features/configuration/hooks/useConfiguration";

export function VenueSettingsPage() {

    const profile =
        useCurrentUser();

    const navigate =
        useNavigate();

    const {
        venue,
        loading: loadingVenue,
    } = useManagedVenue(
        profile?.id ?? "",
    );

    const {
        schedules,
        loading,
    } = useVenueSchedules(
        venue?.id ?? "",
    );

    const {
        configuration,
        loading: loadingConfiguration,
        error: configurationError,
    } = useConfiguration();

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
        openTime,
        setStartTime,
    ] = useState("");

    const [
        closeTime,
        setEndTime,
    ] = useState("");

    const [
        boardNumbers,
        setBoardNumbers,
    ] = useState<number[]>([]);

    const editor =
        useVenueScheduleEditor();

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

        setStartTime(
            "",
        );

        setEndTime(
            "",
        );

        setBoardNumbers(
            [],
        );

        setDrawerOpen(
            true,
        );

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
            schedule.openTime,
        );

        setEndTime(
            schedule.closeTime,
        );

        setBoardNumbers(
            schedule.boardNumbers,
        );

        setDrawerOpen(
            true,
        );

    }

    async function handleDelete(
        schedule: VenueSchedule,
    ) {

        await editor.remove(
            schedule.id,
        );

        /*
         * Aucun refresh manuel nécessaire.
         *
         * useVenueSchedules utilise maintenant
         * onSnapshot().
         */

    }

    async function handleSave() {

        if (selectedSchedule) {

            await editor.update({

                ...selectedSchedule,

                openTime,

                closeTime,

                boardNumbers,

            });

        }
        else {

            if (!venue) {
                return;
            }

            await editor.create({

                venueId:
                    venue.id,

                dayOfWeek:
                    selectedDay,

                openTime,

                closeTime,

                boardNumbers,

                active:
                    true,

            });

        }

        setDrawerOpen(
            false,
        );

    }

    if (
        loading
        ||
        loadingConfiguration
    ) {

        return (

            <AppLayout>

                <AppCard>

                    <CircularProgress />

                </AppCard>

            </AppLayout>

        );

    }

    if (
        configurationError
        ||
        !configuration
    ) {

        return (

            <AppLayout>

                <AppCard>

                    <Typography
                        color="error"
                    >

                        Impossible de charger la configuration de l'application.

                    </Typography>

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
                                    alignItems:
                                        "center",

                                    mb:
                                        3,
                                }}
                            >

                                <Box
                                    component="img"
                                    src={
                                        `/images/venues/${venue.logo}`
                                    }
                                    alt={
                                        venue.name
                                    }
                                    sx={{
                                        width:
                                            64,

                                        height:
                                            64,

                                        objectFit:
                                            "contain",
                                    }}
                                />

                                <Stack>

                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight:
                                                700,
                                        }}
                                    >

                                        {venue.name}

                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >

                                        Horaires hebdomadaires

                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        startIcon={
                                            <SettingsIcon />
                                        }
                                        onClick={() => {

                                            navigate(

                                                availabilityRulesRoute(
                                                    venue.id,
                                                ),

                                            );

                                        }}
                                    >

                                        Règles de disponibilité

                                    </Button>

                                </Stack>

                            </Stack>

                        )
                    }

                    {
                        schedulesByDay.map(

                            day => (

                                <Fragment
                                    key={
                                        day.dayOfWeek
                                    }
                                >

                                    <VenueScheduleCard

                                        dayOfWeek={
                                            day.dayOfWeek
                                        }

                                        schedules={
                                            day.schedules
                                        }

                                        durationMinutes={
                                            configuration.reservationDuration
                                        }

                                        onAdd={
                                            handleAdd
                                        }

                                        onEdit={
                                            handleEdit
                                        }

                                        onDelete={
                                            handleDelete
                                        }

                                    />

                                </Fragment>

                            ),

                        )
                    }

                </Stack>

            </AppCard>

            <VenueScheduleDrawer

                open={
                    drawerOpen
                }

                schedule={
                    selectedSchedule
                }

                startTime={
                    openTime
                }

                endTime={
                    closeTime
                }

                boardNumbers={
                    boardNumbers
                }

                maxBoards={
                    4
                }

                loading={
                    editor.loading
                }

                error={
                    editor.error
                }

                onStartTimeChanged={
                    setStartTime
                }

                onEndTimeChanged={
                    setEndTime
                }

                onBoardNumbersChanged={
                    setBoardNumbers
                }

                onClose={() =>
                    setDrawerOpen(
                        false,
                    )
                }

                onSave={
                    handleSave
                }

            />

        </AppLayout>

    );

}

export default VenueSettingsPage;