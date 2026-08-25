import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import type { TextFieldProps } from "@mui/material/TextField";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function AppPasswordField(
    props: TextFieldProps,
) {
    const [visible, setVisible] = useState(false);

    return (
        <TextField
            fullWidth
            margin="normal"
            type={visible ? "text" : "password"}
            {...props}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                onClick={() => setVisible((v) => !v)}
                            >
                                {visible ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}