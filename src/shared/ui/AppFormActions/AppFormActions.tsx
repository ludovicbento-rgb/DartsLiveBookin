import Stack from "@mui/material/Stack";

import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export function AppFormActions({
    children,
}: Props) {
    return (
        <Stack
            spacing={2}
            sx={{
                mt: 4,
            }}
        >
            {children}
        </Stack>
    );
}