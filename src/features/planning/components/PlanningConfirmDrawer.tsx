import {
    Box,
    Button,
    Divider,
    Drawer,
    Stack,
    TextField,
    Alert,
} from "@mui/material";
import ReservationSummaryCard
    from "./ReservationSummaryCard";

interface Props {

    open: boolean;

    homeTeam: string;

    awayTeam: string;

    venueName: string;

    boardNumber: number;

    start: string;

    end: string;

    reservationDate: Date;

    notes: string;

    loading: boolean;

    onNotesChanged: (
        notes: string,
    ) => void;

    onClose: () => void;

    onConfirm: () => void;

}

export function PlanningConfirmDrawer({

    open,

    homeTeam,

    awayTeam,

    venueName,

    boardNumber,

    start,

    end,

    reservationDate,

    notes,

    loading,

    onNotesChanged,

    onClose,

    onConfirm,

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
                        maxHeight: "85vh",
                    },
                },
            }}
        >

            <Box
                sx={{
                    width: 48,
                    height: 5,
                    bgcolor: "grey.400",
                    borderRadius: 999,
                    mx: "auto",
                    mt: 2,
                    mb: 2,
                }}
            />

            <Box
                sx={{
                    maxWidth: 720,
                    mx: "auto",
                    px: 3,
                    pb: 4,
                    overflowY: "auto",
                    height: "100%",
                }}
            >

                <Stack spacing={2}>

                    <ReservationSummaryCard

                        homeTeam={homeTeam}

                        awayTeam={awayTeam}

                        venueName={venueName}

                        reservationDate={reservationDate}

                        start={start}

                        end={end}

                        boardNumber={boardNumber}

                    />
                    <TextField

                        fullWidth

                        multiline

                        minRows={3}

                        label="Commentaire (facultatif)"

                        placeholder="Ajouter un commentaire pour le gérant..."

                        value={notes}

                        onChange={event =>
                            onNotesChanged(
                                event.target.value,
                            )
                        }

                    />

                    <Divider />

                    <Stack spacing={1}>
                        <Alert

                            severity="info"

                        >

                            Votre demande doit être validée par le gérant
                            de l'établissement.

                        </Alert>

                        <Button

                            variant="contained"

                            color="success"

                            fullWidth

                            size="large"

                            sx={{

                                py: 1.8,

                                fontWeight: 700,

                                borderRadius: 3,

                            }}

                            onClick={onConfirm}

                        >

                            {

                                loading

                                    ? "Envoi..."

                                    : "✓ Confirmer la réservation"

                            }

                        </Button>

                        <Button

                            fullWidth

                            variant="text"

                            onClick={onClose}

                        >

                            Annuler

                        </Button>

                    </Stack>

                </Stack>

            </Box>

        </Drawer>

    );

}

export default PlanningConfirmDrawer;