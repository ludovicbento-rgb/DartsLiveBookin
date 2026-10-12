export function slugifyMatchPart(
    value: string,
): string {

    return value
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            "",
        )
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-",
        )
        .replace(
            /^-+|-+$/g,
            "",
        );

}

export function buildMatchId(
    matchDayId: string,
    homeRegistrationName: string,
    awayRegistrationName: string,
): string {

    return [
        matchDayId,
        slugifyMatchPart(
            homeRegistrationName,
        ),
        slugifyMatchPart(
            awayRegistrationName,
        ),
    ].join("-");

}