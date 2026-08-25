import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

interface AppSnackbarProps {
    open: boolean;
    message: string;
    severity?:
    | "success"
    | "info"
    | "warning"
    | "error";

    onClose: () => void;
}

export function AppSnackbar({
    open,
    message,
    severity = "success",
    onClose,
}: AppSnackbarProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
        >
            <Alert
                severity={severity}
                onClose={onClose}
                sx={{
                    width: "100%",
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}