import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

interface Props {

    open: boolean;

    loading: boolean;

    onClose(): void;

    onConfirm(): void;

}

export function CancelReservationDialog({

    open,

    loading,

    onClose,

    onConfirm,

}: Props) {

    return (

        <Dialog

            open={open}

            onClose={loading ? undefined : onClose}

            maxWidth="xs"

            fullWidth

        >

            <DialogTitle>

                Annuler la réservation

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Êtes-vous certain de vouloir annuler cette réservation ?

                </DialogContentText>

                <DialogContentText
                    sx={{
                        mt: 2,
                    }}
                >

                    Votre créneau redeviendra immédiatement disponible.

                </DialogContentText>

                <DialogContentText
                    sx={{
                        mt: 1,
                        fontWeight: 600,
                    }}
                >

                    Cette action est irréversible.

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button

                    disabled={loading}

                    onClick={onClose}

                >

                    Retour

                </Button>

                <Button

                    color="error"

                    variant="contained"

                    disabled={loading}

                    onClick={onConfirm}

                >

                    Oui, annuler

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default CancelReservationDialog;