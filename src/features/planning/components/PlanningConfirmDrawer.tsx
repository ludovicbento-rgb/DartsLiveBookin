import {
    Box,
    Button,
    Divider,
    Drawer,
    Stack,
    TextField,
    Typography,
    Alert,
} from "@mui/material";

import {
    InfoCard,
} from "@/shared/ui/InfoCard";

interface Props {

    open: boolean;

    matchLabel: string;

    venueName: string;

    boardNumber: number;

    start: string;

    end: string;

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

    matchLabel,

    venueName,

    boardNumber,

    start,

    end,

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

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >

                        Confirmer votre réservation

                    </Typography>

                    <Divider />

                    <InfoCard

                        title="🏆 Match"

                        value={matchLabel}

                        color="error"

                    />

                    <InfoCard

                        title="📍 Établissement"

                        value={venueName}

                        color="success"


                    />

                    <InfoCard

                        title="🕒 Horaire"

                        value={`${start} → ${end}`}

                        color="warning"

                    />

                    <InfoCard

                        title="🎯 Cible"

                        value={`Cible ${boardNumber}`}

                        color="secondary"

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

                            Votre demande sera envoyée au gérant
                            de l'établissement pour validation.

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

                                    : "✓ Envoyer la demande"

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