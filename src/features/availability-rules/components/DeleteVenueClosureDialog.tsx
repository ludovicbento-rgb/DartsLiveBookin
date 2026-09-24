import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

import type {
    VenueClosure,
} from "@/entities/venue-closure";

interface Props {

    open: boolean;

    closure: VenueClosure | null;

    loading: boolean;

    onClose(): void;

    onConfirm(): Promise<void>;

}

function getClosureLabel(
    closure: VenueClosure | null,
): string {

    if (!closure) {

        return "";

    }

    switch (closure.reasonType) {

        case "VACATION":
            return "Vacances";

        case "PRIVATE_EVENT":
            return "Privatisation";

        case "MAINTENANCE":
            return "Maintenance";

        case "INVENTORY":
            return "Inventaire";

        case "OTHER":
            return "Fermeture exceptionnelle";

    }

}

export function DeleteVenueClosureDialog({

    open,

    closure,

    loading,

    onClose,

    onConfirm,

}: Props) {

    return (

        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="xs"
        >

            <DialogTitle>

                Supprimer la fermeture ?

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    La fermeture

                    {" "}

                    <strong>
                        {getClosureLabel(
                            closure,
                        )}
                    </strong>

                    {" "}

                    sera définitivement supprimée.

                </DialogContentText>

                {
                    closure?.comment && (

                        <DialogContentText
                            sx={{
                                mt: 1,
                            }}
                        >

                            {closure.comment}

                        </DialogContentText>

                    )
                }

            </DialogContent>

            <DialogActions>

                <Button
                    disabled={loading}
                    onClick={onClose}
                >
                    Annuler
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    disabled={
                        loading
                        ||
                        !closure
                    }
                    onClick={() => {

                        void onConfirm();

                    }}
                >
                    {
                        loading
                            ? "Suppression..."
                            : "Supprimer"
                    }
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default DeleteVenueClosureDialog;