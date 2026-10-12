import {
  BrowserRouter,
  useRoutes,
} from "react-router-dom";

import {
  routes,
} from "./routes";

import {
  MaintenanceGuard,
} from "@/features/configuration/routes/MaintenanceGuard";

function Router() {

  const content =
    useRoutes(
      routes,
    );

  return (

    <MaintenanceGuard>

      {content}

    </MaintenanceGuard>

  );

}

export function AppRouter() {

  return (

    <BrowserRouter>

      <Router />

    </BrowserRouter>

  );

}