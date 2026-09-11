export function formatReservationDate(

    date: Date,

): string {

    return date.toLocaleDateString(

        "fr-FR",

        {

            weekday: "long",

            day: "numeric",

            month: "long",

        },

    ).replace(

        /^./,

        character => character.toUpperCase(),

    );

}