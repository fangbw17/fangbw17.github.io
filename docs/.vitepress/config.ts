import { defineConfig } from "vitepress";
import { nav } from "./config/nav";
import { sidebar } from "./config/sidebars";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Fangbw",
    description: "Fangbw",
    srcDir: "./src",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: nav,
        sidebar: sidebar,

        socialLinks: [{ icon: "github", link: "https://github.com/fangbw17" }],
    },
});
