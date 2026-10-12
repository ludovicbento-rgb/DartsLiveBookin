import {
  AppRouter,
} from "./app/router/AppRouter";

import {
  PwaUpdatePrompt,
} from "./features/pwa/components/PwaUpdatePrompt";

export default function App() {

  return (

    <>

      <AppRouter />

      <PwaUpdatePrompt />

    </>

  );

}