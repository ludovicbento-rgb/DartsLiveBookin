import {
    IconButton,
    Slide,
    Stack,
    Typography,
    Box,
} from "@mui/material";

import {
    ChevronLeft,
    ChevronRight,
} from "@mui/icons-material";

import { useState } from "react";

import { MatchCard } from "../MatchCard";

import type { MyMatch } from "../../model/my-match";

interface Props {

    matches: MyMatch[];

    onPlan(
        match: MyMatch,
    ): void;

}

export function MatchPager({

    matches,

    onPlan,

}: Props) {

    const [

        current,

        setCurrent,

    ] = useState(0);

    if (matches.length === 0) {

        return null;

    }

    const [

        direction,

        setDirection,

    ] = useState<"left" | "right">(
        "left",
    );

    const match =
        matches[current];

    const [
        touchStart,
        setTouchStart,
    ] = useState<number | null>(null);

    const [
        touchEnd,
        setTouchEnd,
    ] = useState<number | null>(null);

    const MIN_SWIPE_DISTANCE = 60;

    function previous() {

        setDirection("right");

        setCurrent(previous =>

            Math.max(
                previous - 1,
                0,
            ),

        );

    }

    function next() {

        setDirection("left");

        setCurrent(previous =>

            Math.min(

                previous + 1,

                matches.length - 1,

            ),

        );

    }

    function onTouchStart(
        event: React.TouchEvent,
    ) {

        setTouchEnd(null);

        setTouchStart(
            event.targetTouches[0].clientX,
        );

    }

    function onTouchMove(
        event: React.TouchEvent,
    ) {

        setTouchEnd(
            event.targetTouches[0].clientX,
        );

    }

    function onTouchEnd() {

        if (

            touchStart === null ||

            touchEnd === null

        ) {

            return;

        }

        const distance =
            touchStart - touchEnd;

        if (

            distance >

            MIN_SWIPE_DISTANCE

        ) {

            next();

        }

        if (

            distance <

            -MIN_SWIPE_DISTANCE

        ) {

            previous();

        }

    }

    return (

        <Box

            onTouchStart={onTouchStart}

            onTouchMove={onTouchMove}

            onTouchEnd={onTouchEnd}

        >

            <Stack spacing={2}>

                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 1,
                    }}
                >

                    <IconButton

                        onClick={previous}

                        disabled={current === 0}

                        sx={{

                            width: 42,

                            height: 42,

                            border: "1px solid",

                            borderColor: "divider",

                            transition: "0.25s",

                            "&:hover": {

                                bgcolor: "primary.main",

                                color: "white",

                            },

                        }}

                    >

                        <ChevronLeft />

                    </IconButton>

                    <Stack
                        spacing={0.5}
                        sx={{
                            alignItems: "center",
                        }}
                    >

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {`Journée ${match.matchDayNumber}`}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            {current + 1} / {matches.length}

                        </Typography>

                    </Stack>

                    <IconButton

                        onClick={next}

                        disabled={
                            current ===
                            matches.length - 1
                        }

                        sx={{

                            width: 42,

                            height: 42,

                            border: "1px solid",

                            borderColor: "divider",

                            transition: "0.15s",

                            "&:active": {

                                transform: "scale(0.92)",

                            },

                            "&:hover": {

                                bgcolor: "primary.main",

                                color: "white",

                            },

                        }}

                    >

                        <ChevronRight />

                    </IconButton>

                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        justifyContent: "center",
                    }}
                >

                    {

                        matches.map(

                            (match, index) => (

                                <Box

                                    key={match.matchId}

                                    sx={{

                                        width: current === index ? 32 : 14,

                                        height: 14,

                                        borderRadius: "50%",

                                        cursor: "pointer",

                                        bgcolor:

                                            match.status === "PLANNED"

                                                ? "success.main"

                                                : match.status === "PENDING"

                                                    ? "warning.main"

                                                    : "error.main",

                                        opacity:

                                            current === index

                                                ? 1

                                                : 0.35,

                                        transition: "0.25s",

                                    }}

                                    onClick={() =>
                                        setCurrent(index)
                                    }

                                />

                            ),

                        )

                    }

                </Stack>

                <Slide

                    key={match.matchId}

                    in

                    direction={direction}

                    timeout={220}

                    mountOnEnter

                    unmountOnExit

                >

                    <Box>

                        <MatchCard

                            match={match}

                            onPlan={onPlan}

                        />

                    </Box>

                </Slide>

            </Stack>

        </Box>

    );

}