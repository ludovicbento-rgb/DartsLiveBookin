import { useState } from "react";

import type { MatchSelection } from "../model/match-selection";

export function useMatchSelection() {

    const [
        selection,
        setSelection,
    ] =
        useState<MatchSelection | null>(
            null,
        );

    function update(
        value: Partial<MatchSelection>,
    ) {

        setSelection(current => {

            if (!current) {
                return null;
            }

            return {

                ...current,

                ...value,

            };

        });

    }

    function open(
        value: MatchSelection,
    ) {

        setSelection(value);

    }

    function close() {

        setSelection(null);

    }

    return {

        selection,

        opened:
            selection !== null,

        open,

        close,

        update,

    };

}