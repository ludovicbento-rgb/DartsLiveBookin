import MenuItem from "@mui/material/MenuItem";

import { AppTextField } from "@/shared/ui";

import type { Registration } from "../model/registration.types";

interface Props {
    registrations: Registration[];
    value: string;
    onChange: (value: string) => void;
}

export function RegistrationSelector({
    registrations,
    value,
    onChange,
}: Props) {
    return (
        <AppTextField
            select
            label="Mon inscription"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {registrations.map((registration) => (
                <MenuItem
                    key={registration.id}
                    value={registration.id}
                >
                    {registration.displayName}
                </MenuItem>
            ))}
        </AppTextField>
    );
}