import fonts from "./app/config/fonts";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  devServer: {
    // Bind to all interfaces so custom hostnames like bs-local.com work during dev.
    host: "0.0.0.0",
  },

  modules: ["@nuxt/fonts", "@pinia/nuxt"],

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ["node"],
      },
    },
  },

  css: ["./app/assets/css/main.css"],

  fonts: {
    ...fonts,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
