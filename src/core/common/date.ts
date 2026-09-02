export function isDateBetween(

    date: Date,

    start: Date,

    end: Date,

): boolean {

    const normalize = (value: Date) =>

        new Date(

            value.getFullYear(),
            value.getMonth(),
            value.getDate(),

        ).getTime();

    const target = normalize(date);

    return (

        target >= normalize(start)

        &&

        target <= normalize(end)

    );

}