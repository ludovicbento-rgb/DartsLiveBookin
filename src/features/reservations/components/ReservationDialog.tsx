import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import StorefrontIcon from "@mui/icons-material/Storefront";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

import type {
    MatchListItem,
} from "@/features/matches/model/match-list-item";

import type {
    ReservationSelection,
} from "../hooks/useReservationDialog";

interface Props {

    open: boolean;

    selection: ReservationSelection | null;

    matches: MatchListItem[];

    loading: boolean;

    loadingMatches: boolean;

    onClose: () => void;

    onConfirm: () => void;

    onMatchChanged: (
        matchId: string,
    ) => void;

    onNotesChanged: (
        notes: string,
    ) => void;

}

export function ReservationDialog({

    open,

    selection,

    matches,

    loading,

    loadingMatches,

    onClose,

    onConfirm,

    onMatchChanged,

    onNotesChanged,

}: Props) {

    if (!selection) {

        return null;

    }

    const start =
        selection.plannedStartAt
            .toDate()
            .toLocaleTimeString(
                "fr-FR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                },
            );

    const end =
        selection.plannedEndAt
            .toDate()
            .toLocaleTimeString(
                "fr-FR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                },
            );

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                Planifier un match

            </DialogTitle>

            <DialogContent>

                <Stack spacing={3}>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <StorefrontIcon />

                        <Typography>

                            {selection.venueName}

                        </Typography>

                    </Stack>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <ScheduleIcon />

                        <Typography>

                            {start} - {end}

                        </Typography>

                    </Stack>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <SportsEsportsIcon />

                        <Typography>

                            Cible {selection.boardNumber}

                        </Typography>

                    </Stack>

                    <FormControl fullWidth>

                        <InputLabel>

                            Match

                        </InputLabel>

                        <Select

                            value={
                                selection.matchId
                            }

                            label="Match"

                            disabled={
                                loadingMatches
                            }

                            onChange={event =>
                                onMatchChanged(
                                    event.target.value,
                                )
                            }

                        >

                            {matches.map(match => (

                                <MenuItem

                                    key={match.id}

                                    value={match.id}

                                >

                                    {match.label}

                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>

                    <TextField

                        fullWidth

                        label="Commentaire"

                        multiline

                        minRows={3}

                        value={selection.notes}

                        disabled={
                            selection.matchId === ""
                        }

                        onChange={event =>
                            onNotesChanged(
                                event.target.value,
                            )
                        }

                    />

                    <Alert severity="info">

                        Cette demande sera envoyée
                        au gérant de
                        l'établissement pour validation.

                    </Alert>

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >

                    Annuler

                </Button>

                <Button

                    variant="contained"

                    onClick={onConfirm}

                    disabled={

                        loading ||

                        loadingMatches ||

                        selection.matchId === ""

                    }

                >

                    {

                        loading

                            ? "Planification..."

                            : "Planifier"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ReservationDialog;