import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface BoardSlotProps {
    boardNumber: number;
    available: boolean;
    onSelect?: () => void;
}

export function BoardSlot({
    boardNumber,
    available,
    onSelect,
}: BoardSlotProps) {
    return (
        <Card
            variant="outlined"
            sx={{
                width: 150,
                borderColor: available ? "success.main" : "error.main",
            }}
        >
            <CardActionArea
                disabled={!available}
                onClick={available ? onSelect : undefined}
            >
                <CardContent
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        🎯 {boardNumber}
                    </Typography>

                    <Typography
                        color={
                            available
                                ? "success.main"
                                : "error.main"
                        }
                        sx={{
                            fontWeight: 600,
                        }}
                    >
                        {available
                            ? "Disponible"
                            : "Réservée"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}