import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface Props {
    children: ReactNode;
}

export function ProtectedRoute({
    children,
}: Props) {
    const {
        loading,
        firebaseUser,
    } = useAuth();

    if (loading) {
        return null;
    }

    if (!firebaseUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}