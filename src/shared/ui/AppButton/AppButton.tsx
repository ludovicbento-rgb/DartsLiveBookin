import Button from "@mui/material/Button";

import type { ButtonProps } from "@mui/material/Button";

export function AppButton(props: ButtonProps) {
    return (
        <Button
            fullWidth
            size="large"
            variant="contained"
            {...props}
        />
    );
}