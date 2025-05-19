require('dotenv').config();
const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
    env: {
      apiBaseUrl: process.env.API_BASE_URL,
      checkEmailEndpoint: process.env.CHECK_EMAIL_ENDPOINT,
      verifyUserEndpoint: process.env.VERIFY_USER_ENDPOINT,
      mailslurpApiKey: process.env.MAILSLURP_API_KEY,
    },
    specPattern: [
      'cypress/e2e/thirdTest.cy.js',
    ],
    defaultCommandTimeout: 60000, 
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    watchForFileChanges: false,
  },
});
