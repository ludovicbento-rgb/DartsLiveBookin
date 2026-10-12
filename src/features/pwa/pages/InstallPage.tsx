import {
    Alert,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import DownloadIcon
    from "@mui/icons-material/Download";

import CheckCircleIcon
    from "@mui/icons-material/CheckCircle";

import IosShareIcon
    from "@mui/icons-material/IosShare";

import AddBoxOutlinedIcon
    from "@mui/icons-material/AddBoxOutlined";

import PhoneIphoneIcon
    from "@mui/icons-material/PhoneIphone";

import {
    useNavigate,
} from "react-router-dom";

import {
    AppLayout,
} from "@/app/layouts/AppLayout";

import {
    usePwaInstall,
} from "../hooks/usePwaInstall";

export function InstallPage() {

    const navigate =
        useNavigate();

    const pwa =
        usePwaInstall();

    /*
     * ============================================================
     * APPLICATION DEJA INSTALLEE
     * ============================================================
     */

    if (pwa.installed) {

        return (

            <AppLayout>

                <Stack
                    spacing={3}
                    sx={{
                        maxWidth:
                            560,

                        mx:
                            "auto",

                        py:
                            5,
                    }}
                >

                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius:
                                4,
                        }}
                    >

                        <CardContent>

                            <Stack
                                spacing={3}
                                sx={{
                                    alignItems:
                                        "center",

                                    textAlign:
                                        "center",

                                    py:
                                        3,
                                }}
                            >

                                <CheckCircleIcon
                                    color="success"
                                    sx={{
                                        fontSize:
                                            64,
                                    }}
                                />

                                <Stack spacing={1}>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight:
                                                700,
                                        }}
                                    >

                                        DartsLive Bookin est installé

                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >

                                        L'application est prête à être utilisée sur cet appareil.

                                    </Typography>

                                </Stack>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() =>
                                        navigate(
                                            "/",
                                        )
                                    }
                                >

                                    Ouvrir l'application

                                </Button>

                            </Stack>

                        </CardContent>

                    </Card>

                </Stack>

            </AppLayout>

        );

    }

    return (

        <AppLayout>

            <Stack
                spacing={3}
                sx={{
                    maxWidth:
                        560,

                    mx:
                        "auto",

                    py:
                        4,
                }}
            >

                <Stack
                    spacing={1}
                    sx={{
                        textAlign:
                            "center",

                        alignItems:
                            "center",
                    }}
                >

                    <PhoneIphoneIcon
                        color="primary"
                        sx={{
                            fontSize:
                                56,
                        }}
                    />

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight:
                                700,
                        }}
                    >

                        Installer DartsLive Bookin

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        Ajoutez l'application à votre téléphone pour accéder rapidement à vos matchs et réservations.

                    </Typography>

                </Stack>

                <Card
                    variant="outlined"
                    sx={{
                        borderRadius:
                            4,
                    }}
                >

                    <CardContent>

                        <Stack spacing={3}>

                            {
                                pwa.platform ===
                                "IOS"
                                && (

                                    <>

                                        <Alert severity="info">

                                            Sur iPhone et iPad, l'installation se fait depuis le menu de partage de Safari.

                                        </Alert>

                                        <Stack spacing={2}>

                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                sx={{
                                                    alignItems:
                                                        "center",
                                                }}
                                            >

                                                <IosShareIcon
                                                    color="primary"
                                                />

                                                <Typography>

                                                    1. Touchez le bouton <strong>Partager</strong> dans Safari.

                                                </Typography>

                                            </Stack>

                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                sx={{
                                                    alignItems:
                                                        "center",
                                                }}
                                            >

                                                <AddBoxOutlinedIcon
                                                    color="primary"
                                                />

                                                <Typography>

                                                    2. Choisissez <strong>Sur l'écran d'accueil</strong>.

                                                </Typography>

                                            </Stack>

                                            <Typography>

                                                3. Touchez <strong>Ajouter</strong> pour terminer l'installation.

                                            </Typography>

                                        </Stack>

                                    </>

                                )
                            }

                            {
                                pwa.platform !==
                                "IOS"
                                &&
                                pwa.canInstall
                                && (

                                    <>

                                        <Typography
                                            sx={{
                                                fontWeight:
                                                    600,
                                            }}
                                        >

                                            DartsLive Bookin peut être installé sur cet appareil.

                                        </Typography>

                                        <Button
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            startIcon={
                                                <DownloadIcon />
                                            }
                                            onClick={() => {

                                                void pwa.install();

                                            }}
                                        >

                                            Installer l'application

                                        </Button>

                                    </>

                                )
                            }

                            {
                                pwa.platform !==
                                "IOS"
                                &&
                                !pwa.canInstall
                                && (

                                    <Alert severity="info">

                                        Si l'option d'installation n'apparaît pas encore, ouvrez le menu de votre navigateur et choisissez « Installer l'application » ou « Ajouter à l'écran d'accueil ».

                                    </Alert>

                                )
                            }

                            <Divider />

                            <Stack spacing={1}>

                                <Typography
                                    sx={{
                                        fontWeight:
                                            600,
                                    }}
                                >

                                    Pourquoi installer l'application ?

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    • Accès rapide depuis votre écran d'accueil

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    • Affichage comme une application mobile

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    • Mises à jour simplifiées

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    • Aucun App Store ou Play Store nécessaire

                                </Typography>

                            </Stack>

                        </Stack>

                    </CardContent>

                </Card>

            </Stack>

        </AppLayout>

    );

}

export default InstallPage;