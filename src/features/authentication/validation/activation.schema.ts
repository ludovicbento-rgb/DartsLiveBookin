import { z } from "zod";

export const activationSchema = z
    .object({
        licenseNumber: z
            .string()
            .trim()
            .min(1, "Le numéro de licence est obligatoire."),

        email: z
            .email("Adresse e-mail invalide."),

        password: z
            .string()
            .min(
                8,
                "Le mot de passe doit contenir au moins 8 caractères.",
            ),

        confirmPassword: z.string(),
    })
    .refine(
        (values) =>
            values.password === values.confirmPassword,
        {
            path: ["confirmPassword"],
            message:
                "Les mots de passe sont différents.",
        },
    );

export type ActivationFormValues =
    z.infer<typeof activationSchema>;