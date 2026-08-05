import Typography from "@mui/material/Typography";

import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export function PageTitle({
    children,
}: Props) {
    return (
        <Typography
            variant="h4"
            gutterBottom
            sx={{
                fontWeight: 700,
                textAlign: "center",
            }}
        >
            {children}
        </Typography>
    );
}