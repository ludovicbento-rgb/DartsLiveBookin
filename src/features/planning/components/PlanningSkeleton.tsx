import {
    Card,
    CardContent,
    Skeleton,
    Stack,
} from "@mui/material";

export function PlanningSkeleton() {

    return (

        <Stack spacing={3}>

            <Card variant="outlined">

                <CardContent>

                    <Stack spacing={2}>

                        <Skeleton
                            variant="text"
                            width={220}
                            height={40}
                        />

                        <Skeleton
                            variant="text"
                            width={180}
                            height={24}
                        />

                        <Stack
                            direction="row"
                            spacing={1}
                        >

                            <Skeleton
                                variant="rounded"
                                width={120}
                                height={32}
                            />

                            <Skeleton
                                variant="rounded"
                                width={120}
                                height={32}
                            />

                            <Skeleton
                                variant="rounded"
                                width={120}
                                height={32}
                            />

                        </Stack>

                    </Stack>

                </CardContent>

            </Card>

            <Card variant="outlined">

                <CardContent>

                    <Stack spacing={2}>

                        {

                            Array.from({

                                length: 6,

                            }).map((_, index) => (

                                <Skeleton

                                    key={index}

                                    variant="rounded"

                                    height={52}

                                />

                            ))

                        }

                    </Stack>

                </CardContent>

            </Card>

        </Stack>

    );

}

export default PlanningSkeleton;