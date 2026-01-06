const { defineConfig } = require("cypress");
const { startMonitoring, stopMonitoring } = require("./metrics");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",

    env: {
      allureResultsPath: "allure-results/cypress",
    },

    setupNodeEvents(on, config) {
      on("task", {
        startMonitoring() {
          startMonitoring();
          return null;
        },
        stopMonitoring({ mode, browser }) {
          stopMonitoring("Cypress", mode, browser);
          return null;
        },
      });

      allureWriter(on, config);
      return config;
    },
  },

  video: false,
  screenshotOnRunFailure: true,
  experimentalStudio: true,
});
