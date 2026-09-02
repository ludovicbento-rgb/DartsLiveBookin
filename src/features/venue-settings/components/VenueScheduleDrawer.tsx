import {
    Alert,
    Box,
    Button,
    Drawer,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    TIME_SLOTS,
} from "@/shared/constants/time-slots";

import type {
    VenueSchedule,
} from "@/entities/venue-schedule";

interface Props {

    open: boolean;

    startTime: string;

    endTime: string;

    boardNumbers: number[];

    maxBoards: number;

    loading: boolean;

    error: string | null;

    onStartTimeChanged(
        value: string,
    ): void;

    onEndTimeChanged(
        value: string,
    ): void;

    onBoardNumbersChanged(
        boards: number[],
    ): void;

    onClose(): void;

    onSave(): void;

    schedule: VenueSchedule | null;

}

export function VenueScheduleDrawer({

    open,

    startTime,

    endTime,

    boardNumbers,

    maxBoards,

    loading,

    error,

    onStartTimeChanged,

    onEndTimeChanged,

    onBoardNumbersChanged,

    onClose,

    onSave,

    schedule,

}: Props) {
    return (

        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,

                        width: {
                            xs: "100%",
                            sm: 600,
                        },

                        maxWidth: "100%",

                        margin: "0 auto",

                        p: 3,
                    },
                },
            }}
        >

            <Box>

                <Stack spacing={3}>

                    <Typography
                        variant="h5"
                    >

                        Nouveau créneau

                    </Typography>

                    <TextField
                        select
                        label="Début"
                        value={startTime}
                        onChange={(event) =>
                            onStartTimeChanged(
                                event.target.value,
                            )
                        }
                    >
                        {TIME_SLOTS.map(time => (
                            <MenuItem
                                key={time}
                                value={time}
                            >
                                {time}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField

                        select

                        fullWidth

                        label="Fin"

                        value={endTime}

                        onChange={(event) =>
                            onEndTimeChanged(
                                event.target.value,
                            )
                        }

                    >

                        {

                            TIME_SLOTS.map(time => (

                                <MenuItem

                                    key={time}

                                    value={time}

                                >

                                    {time}

                                </MenuItem>

                            ))

                        }

                    </TextField>

                    <TextField
                        select
                        label="Nombre de cibles"
                        value={boardNumbers.length}
                        onChange={event => {

                            const count =
                                Number(
                                    event.target.value,
                                );

                            onBoardNumbersChanged(

                                Array.from(

                                    {
                                        length: count,
                                    },

                                    (_, index) =>
                                        index + 1,

                                ),

                            );

                        }}
                    >

                        {

                            Array.from(

                                {
                                    length: maxBoards,
                                },

                                (_, index) => (

                                    <MenuItem
                                        key={index + 1}
                                        value={index + 1}
                                    >

                                        {index + 1}

                                    </MenuItem>

                                ),

                            )

                        }

                    </TextField>

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        {

                            error && (

                                <Alert
                                    severity="error"
                                >

                                    {error}

                                </Alert>

                            )

                        }
                        <Button
                            fullWidth
                            onClick={onClose}
                        >
                            Annuler
                        </Button>

                        <Button

                            fullWidth

                            variant="contained"

                            disabled={loading}

                            onClick={onSave}

                        >

                            {

                                loading

                                    ? "Enregistrement..."

                                    : schedule

                                        ? "Modifier"

                                        : "Créer"

                            }

                        </Button>

                    </Stack>

                </Stack>

            </Box>

        </Drawer>

    );

}

export default VenueScheduleDrawer;