
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",

  projects: [
    {
      name: "chrome",
      use: {
        browserName: "chromium",
        channel: "chrome",
        headless: true,
        baseURL: "http://localhost:3000",
        viewport: { width: 1280, height: 720 },
        actionTimeout: 5000,
        trace: "on-first-retry",
      },
    },

    {
      name: "firefox",
      use: {
        browserName: "firefox",
        headless: true,
        baseURL: "http://localhost:3000",
        viewport: { width: 1280, height: 720 },
        actionTimeout: 5000,
        trace: "on-first-retry",
      },
    }
  ],

  reporter: [
  ["line"],
  ["allure-playwright", { outputFolder: "allure-results" }]
  ]
});

