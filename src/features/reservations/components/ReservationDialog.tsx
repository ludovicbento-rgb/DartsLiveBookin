import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";

import type {
    ReservationSelection,
} from "../hooks/useReservationDialog";

interface Props {
    open: boolean;
    selection: ReservationSelection | null;
    onClose: () => void;
    onConfirm: () => void;
}

export function ReservationDialog({
    open,
    selection,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Réserver cette cible
            </DialogTitle>

            <DialogContent>
                {selection && (
                    <Stack spacing={2}>
                        <Typography>
                            <strong>Bar :</strong>{" "}
                            {selection.venueName}
                        </Typography>

                        <Typography>
                            <strong>Créneau :</strong>{" "}
                            {selection.startAt
                                .toDate()
                                .toLocaleTimeString(
                                    "fr-FR",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )}
                            {" - "}
                            {selection.endAt
                                .toDate()
                                .toLocaleTimeString(
                                    "fr-FR",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )}
                        </Typography>

                        <Typography>
                            <strong>Cible :</strong>{" "}
                            {selection.boardNumber}
                        </Typography>
                    </Stack>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Annuler
                </Button>

                <Button
                    variant="contained"
                    onClick={onConfirm}
                >
                    Confirmer
                </Button>
            </DialogActions>
        </Dialog>
    );
}