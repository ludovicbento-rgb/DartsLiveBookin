import {
    doc,
} from "firebase/firestore";

import {
    db,
} from "@/shared/firebase";

export function activationLicenseDocument(
    licenseNumber: string,
) {

    return doc(
        db,
        "activation-licenses",
        licenseNumber,
    );

}