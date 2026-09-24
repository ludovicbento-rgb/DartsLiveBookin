import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

import type {
    AvailabilityRule,
} from "@/entities/availability-rule";

interface Props {

    open: boolean;

    rule: AvailabilityRule | null;

    loading: boolean;

    onClose(): void;

    onConfirm(): Promise<void>;

}

export function DeleteAvailabilityRuleDialog({

    open,

    rule,

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

                Supprimer la règle ?

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    La règle

                    {" "}

                    <strong>
                        {rule?.title ?? ""}
                    </strong>

                    {" "}

                    sera définitivement supprimée.

                </DialogContentText>

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
                        !rule
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

export default DeleteAvailabilityRuleDialog;