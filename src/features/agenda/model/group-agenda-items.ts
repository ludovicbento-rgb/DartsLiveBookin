import type {
    AgendaItem,
} from "./agenda-item";

export interface AgendaGroup {

    key: string;

    label: string;

    items: AgendaItem[];

}

function startOfDay(
    value: Date,
): Date {

    const result =
        new Date(value);

    result.setHours(
        0,
        0,
        0,
        0,
    );

    return result;

}

function getDateKey(
    value: Date,
): string {

    const year =
        value.getFullYear();

    const month =
        String(
            value.getMonth() + 1,
        ).padStart(
            2,
            "0",
        );

    const day =
        String(
            value.getDate(),
        ).padStart(
            2,
            "0",
        );

    return `${year}-${month}-${day}`;

}

function getDateLabel(
    date: Date,
): string {

    const today =
        startOfDay(
            new Date(),
        );

    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1,
    );

    const target =
        startOfDay(
            date,
        );

    if (
        target.getTime()
        ===
        today.getTime()
    ) {

        return "Aujourd'hui";

    }

    if (
        target.getTime()
        ===
        tomorrow.getTime()
    ) {

        return "Demain";

    }

    return target.toLocaleDateString(
        "fr-FR",
        {
            weekday:
                "long",

            day:
                "numeric",

            month:
                "long",

            year:
                "numeric",
        },
    );

}

export function groupAgendaItems(

    items: AgendaItem[],

): AgendaGroup[] {

    const groups =
        new Map<
            string,
            AgendaItem[]
        >();

    for (const item of items) {

        const date =
            item.plannedStartAt.toDate();

        const key =
            getDateKey(
                date,
            );

        const current =
            groups.get(key)
            ??
            [];

        current.push(
            item,
        );

        groups.set(
            key,
            current,
        );

    }

    return Array.from(
        groups.entries(),
    )
        .sort(
            ([keyA], [keyB]) =>
                keyA.localeCompare(
                    keyB,
                ),
        )
        .map(
            ([key, groupItems]) => {

                const firstItem =
                    groupItems[0];

                return {

                    key,

                    label:
                        getDateLabel(
                            firstItem
                                .plannedStartAt
                                .toDate(),
                        ),

                    items:
                        [...groupItems]
                            .sort(
                                (a, b) => {

                                    const time =
                                        a.plannedStartAt
                                            .toMillis()
                                        -
                                        b.plannedStartAt
                                            .toMillis();

                                    if (
                                        time !== 0
                                    ) {

                                        return time;

                                    }

                                    return (
                                        a.boardNumber
                                        -
                                        b.boardNumber
                                    );

                                },
                            ),

                };

            },
        );

}