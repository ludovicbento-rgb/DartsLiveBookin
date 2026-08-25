import { useState } from "react";

import type {
    BoardSlot,
    TimeSlot,
} from "../model/planning.types";

export interface SelectedSlot {
    slot: TimeSlot;
    board: BoardSlot;
}

export function useSelectedSlot() {
    const [selection, setSelection] =
        useState<SelectedSlot | null>(null);

    function select(
        slot: TimeSlot,
        board: BoardSlot,
    ) {
        setSelection({
            slot,
            board,
        });
    }

    function clear() {
        setSelection(null);
    }

    return {
        selection,
        select,
        clear,
    };
}