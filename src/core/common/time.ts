export function toMinutes(
    time: string,
): number {

    const [
        h,
        m,
    ] = time.split(":").map(Number);

    return h * 60 + m;

}

export function toTime(
    totalMinutes: number,
): string {

    const MINUTES_PER_DAY = 24 * 60;

    const normalized =
        ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY)
        % MINUTES_PER_DAY;

    const hours =
        Math.floor(normalized / 60);

    const minutes =
        normalized % 60;

    return `${hours
        .toString()
        .padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;

}

export function addMinutes(
    time: string,
    duration: number,
): string {

    return toTime(
        toMinutes(time) + duration,
    );

}