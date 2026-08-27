import type { RouteObject } from "react-router-dom";

import MyMatchesPage from "./pages/MyMatchesPage";

export const matchRoutes: RouteObject[] = [

    {

        path: "/matches",

        element: <MyMatchesPage />,

    },

];