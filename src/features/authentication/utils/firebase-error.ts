export function getFirebaseErrorMessage(
    code: string,
): string {
    switch (code) {
        case "auth/invalid-credential":
            return "Adresse email ou mot de passe incorrect.";

        case "auth/email-already-in-use":
            return "Cette adresse email est déjà utilisée.";

        case "auth/weak-password":
            return "Le mot de passe est trop faible.";

        case "auth/invalid-email":
            return "Adresse email invalide.";

        default:
            return "Une erreur est survenue.";
    }
}