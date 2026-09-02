import {
    useEffect,
    useState,
} from "react";

import {
    subscribePendingMatches,
} from "../api/reservation-validation.subscription";

export function usePendingReservationCount() {

    const [
        count,
        setCount,
    ] = useState(0);

    useEffect(() => {

        const unsubscribe =
            subscribePendingMatches(

                () => {

                    setCount(
                        previous =>
                            previous + 1,
                    );

                },

            );

        return unsubscribe;

    }, []);

    return count;

}