
const { defineConfig } = require("cypress");
const { startMonitoring, stopMonitoring } = require("./metrics");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",

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
    },
  },

  video: false,
  screenshotOnRunFailure: true,
  experimentalStudio: true,

});
