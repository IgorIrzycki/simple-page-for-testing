const { defineConfig } = require("cypress");
const { startMonitoring, stopMonitoring } = require("./metrics");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",

    env: {
    allureResultsPath: "allure-results",
    allureClearResults: false,
    allureReuseAfterSpec: true,
    },


    setupNodeEvents(on, config) {
      on("task", {
        startMonitoring() {
          if (process.platform === "win32") return null;
          startMonitoring();
          return null;
        },
        stopMonitoring({ mode, browser }) {
          if (process.platform === "win32") return null;
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
