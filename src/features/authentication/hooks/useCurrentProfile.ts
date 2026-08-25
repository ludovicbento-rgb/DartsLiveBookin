import {
    useContext,
} from "react";

import {
    UserProfileContext,
} from "../context/UserProfileContext";

export function useCurrentProfile() {

    return useContext(
        UserProfileContext,
    );

}