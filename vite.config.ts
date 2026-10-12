import {
  defineConfig,
} from "vite";

import react
  from "@vitejs/plugin-react";

import {
  VitePWA,
} from "vite-plugin-pwa";

import {
  readFileSync,
} from "node:fs";

import path
  from "node:path";

const packageJson =
  JSON.parse(
    readFileSync(
      "./package.json",
      "utf-8",
    ),
  ) as {
    version: string;
  };

const appVersion =
  packageJson.version;
export default defineConfig({

  define: {

    __APP_VERSION__:
      JSON.stringify(
        appVersion,
      ),

  },

  plugins: [

    react(),

    {
      name:
        "generate-version-file",

      generateBundle() {

        this.emitFile({

          type:
            "asset",

          fileName:
            "version.json",

          source:
            JSON.stringify(
              {
                version:
                  appVersion,
              },
              null,
              2,
            ),

        });

      },
    },

    VitePWA({

      registerType:
        "prompt",

      injectRegister:
        null,

      manifest: {

        name:
          "DartsLive Bookin",

        short_name:
          "DartsLive",

        description:
          "Réservation des créneaux pour les championnats de France DartsLive",

        lang:
          "fr",

        id:
          "/",

        start_url:
          "/",

        scope:
          "/",

        display:
          "standalone",

        orientation:
          "portrait",

        theme_color:
          "#ffffff",

        background_color:
          "#ffffff",

        icons: [

          {
            src:
              "/icons/pwa-192x192.png",

            sizes:
              "192x192",

            type:
              "image/png",

            purpose:
              "any",
          },

          {
            src:
              "/icons/pwa-512x512.png",

            sizes:
              "512x512",

            type:
              "image/png",

            purpose:
              "any",
          },

          {
            src:
              "/icons/pwa-maskable-512x512.png",

            sizes:
              "512x512",

            type:
              "image/png",

            purpose:
              "maskable",
          },

        ],

      },

    }),

  ],

  resolve: {

    alias: {

      "@":
        path.resolve(
          __dirname,
          "./src",
        ),

    },

  },

});