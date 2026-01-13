import type { ModuleOptions } from "@nuxt/fonts";

const fontsConfig: Partial<ModuleOptions> = {
  families: [
    {
      global: true,
      provider: "google",
      name: "Urbanist",
      subsets: ["latin", "latin-ext"],
      weights: [400, 500, 600, 700, 800],
      styles: ["normal", "italic"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
};

export default fontsConfig;
