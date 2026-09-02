function toMinutes(
    time: string,
): number {

    const [

        hours,

        minutes,

    ] = time
        .split(":")
        .map(Number);

    return hours * 60 + minutes;

}

function toTime(
    totalMinutes: number,
): string {

    const hours =
        Math.floor(
            totalMinutes / 60,
        );

    const minutes =
        totalMinutes % 60;

    return `${hours
        .toString()
        .padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;

}

export function addMinutes(

    time: string,

    minutes: number,

): string {

    return toTime(

        toMinutes(time) + minutes,

    );

}