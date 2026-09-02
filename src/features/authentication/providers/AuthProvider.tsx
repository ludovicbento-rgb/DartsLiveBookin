import {
    onAuthStateChanged,
    type User as FirebaseUser,
} from "firebase/auth";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type { ReactNode } from "react";

import { auth } from "@/shared/firebase";

import { authService } from "../api/auth.service";
import { AuthContext } from "../context/AuthContext";

import {
    getUserByFirebaseUid,
} from "@/entities/user";

import type {
    UserProfile,
} from "@/entities/user";

interface Props {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: Props) {

    const [
        firebaseUser,
        setFirebaseUser,
    ] = useState<FirebaseUser | null>(null);

    const [
        userProfile,
        setUserProfile,
    ] = useState<UserProfile | null>(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                async currentUser => {

                    setFirebaseUser(currentUser);

                    if (currentUser) {

                        const profile =
                            await getUserByFirebaseUid(
                                currentUser.uid,
                            );

                        setUserProfile(profile);

                    } else {

                        setUserProfile(null);

                    }

                    setLoading(false);

                },
            );

        return unsubscribe;

    }, []);

    async function login(
        email: string,
        password: string,
    ) {

        await authService.login({
            email,
            password,
        });

    }

    async function register(
        email: string,
        password: string,
    ) {

        await authService.register({
            email,
            password,
        });

    }

    async function logout() {

        await authService.logout();

    }

    const value = useMemo(
        () => ({

            firebaseUser,

            userProfile,

            loading,

            login,

            register,

            logout,

        }),
        [
            firebaseUser,
            userProfile,
            loading,
        ],
    );

    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>

    );

}