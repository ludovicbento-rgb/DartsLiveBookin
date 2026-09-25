import {
    Button,
} from "@mui/material";

import ArrowBackIcon
    from "@mui/icons-material/ArrowBack";

import {
    useNavigate,
} from "react-router-dom";

interface Props {

    to?: string;

    label?: string;

}

export function BackButton({

    to,

    label = "Retour",

}: Props) {

    const navigate =
        useNavigate();

    return (

        <Button
            variant="text"
            startIcon={
                <ArrowBackIcon />
            }
            onClick={() => {

                if (to) {

                    navigate(to);

                    return;

                }

                navigate(-1);

            }}
            sx={{
                alignSelf: "flex-start",
                minWidth: 0,
            }}
        >

            {label}

        </Button>

    );

}

export default BackButton;  