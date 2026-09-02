import { useAuth } from "./useAuth";

export function useCurrentUser() {

    const {
        userProfile,
    } = useAuth();

    return userProfile;

}