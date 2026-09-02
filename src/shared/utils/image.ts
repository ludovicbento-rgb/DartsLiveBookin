export function imagePath(

    folder: string,

    filename: string | null | undefined,

    fallback = "default.jpg",

): string {

    return filename

        ? `/images/${folder}/${filename}`

        : `/images/${folder}/${fallback}`;

}