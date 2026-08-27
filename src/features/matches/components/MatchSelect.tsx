import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";

import type {
    Match,
} from "@/entities/match";

interface MatchSelectProps {

    matches: Match[];

    value: string;

    getLabel: (
        match: Match,
    ) => string;

    onChange: (
        matchId: string,
    ) => void;

    disabled?: boolean;

}

export function MatchSelect({

    matches,

    value,

    getLabel,

    onChange,

    disabled = false,

}: MatchSelectProps) {

    return (

        <FormControl fullWidth>

            <InputLabel>

                Match

            </InputLabel>

            <Select

                value={value}

                label="Match"

                disabled={disabled}

                onChange={event =>
                    onChange(
                        event.target.value,
                    )
                }

            >

                {matches.map(match => (

                    <MenuItem

                        key={match.id}

                        value={match.id}

                    >

                        {getLabel(match)}

                    </MenuItem>

                ))}

            </Select>

        </FormControl>

    );

}