import {
    Button,
    Drawer,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

interface Props {

    open: boolean;

    loading: boolean;

    reason: string;

    onReasonChange(
        value: string,
    ): void;

    onClose(): void;

    onConfirm(): void;

}

export function RejectReservationDrawer({

    open,

    loading,

    reason,

    onReasonChange,

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

                        p: 3,

                    },

                },

            }}

        >

            <Stack spacing={3}>

                <Typography

                    variant="h5"

                    sx={{

                        fontWeight: 700,

                    }}

                >

                    Refuser la réservation

                </Typography>

                <Typography>

                    Merci d'indiquer le motif du refus.

                </Typography>

                <TextField

                    label="Motif"

                    multiline

                    minRows={4}

                    value={reason}

                    onChange={event =>

                        onReasonChange(

                            event.target.value,

                        )

                    }

                />

                <Stack

                    direction="row"

                    spacing={2}

                >

                    <Button

                        fullWidth

                        variant="outlined"

                        onClick={onClose}

                    >

                        Annuler

                    </Button>

                    <Button

                        fullWidth

                        color="error"

                        variant="contained"

                        disabled={

                            loading ||

                            reason.trim() === ""

                        }

                        onClick={onConfirm}

                    >

                        Refuser

                    </Button>

                </Stack>

            </Stack>

        </Drawer>

    );

}

export default RejectReservationDrawer;