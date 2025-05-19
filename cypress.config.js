const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
      baseUrl: 'https://upticker.xeventechnologies.com',
    env: {
      apiBaseUrl: 'https://uptickerbe.xeventechnologies.com/api',
      verifyUserEndpoint: '/auth/verify-user',
      checkEmailEndpoint: '/auth/check-email',
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
