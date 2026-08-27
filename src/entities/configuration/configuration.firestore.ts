import { doc } from "firebase/firestore";

import { db } from "@/shared/firebase";

export const configurationDocument =
    doc(
        db,
        "system",
        "configuration",
    );  