const apiBaseUrl = Cypress.env('apiBaseUrl');
const verifyUserEndpoint = Cypress.env('verifyUserEndpoint');
const checkEmailEndpoint = Cypress.env('checkEmailEndpoint');

describe('Bulk signup and report test', () => {
  const numberOfUsers = 2;
  const signupResults = [];

  it('Should signup 10 emails and verify them', () => {
    // Loop through 10 times using Cypress.Promise.all
    const tasks = Cypress._.times(numberOfUsers, () => {
      return cy.mailslurp().then(mailslurp => {
        return mailslurp.createInbox().then(inbox => {
          const inboxId = inbox.id;
          const emailAddress = inbox.emailAddress;

          return cy.request({
            method: 'POST',
            url: `${apiBaseUrl}${checkEmailEndpoint}`,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: { email: emailAddress },
            failOnStatusCode: false
          }).then((res) => {
            expect(res.status).to.eq(201);
            return mailslurp.waitForLatestEmail(inboxId, 30000, true).then(email => {
              const html = document.createElement('html');
              html.innerHTML = email.body;

              const linkElement = Array.from(html.querySelectorAll('a')).find(a => a.textContent.includes('Login Now'));
const loginUrl = linkElement?.getAttribute('href');
expect(loginUrl).to.match(/^http/);

              // Visit the login link
              return cy.visit(loginUrl).then(() => {
                return cy.url().should('include', '/verify/').then(currentUrl => {
                  const token = currentUrl.split('/verify/')[1];

                  return cy.request({
                    method: 'POST',
                    url: `${apiBaseUrl}${verifyUserEndpoint}`,
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                    },
                    body: {
                      userToken: token,
                      fcmToken: null
                    }
                  }).then((res) => {
                    expect(res.status).to.eq(201);
                    signupResults.push({
                      signupEmail: emailAddress,
                      message: 'Signup and verification successful.',
                      timestamp: new Date().toISOString()
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    // Wait for all signup tasks to complete
    return Cypress.Promise.all(tasks).then(() => {
      // Write result file
      cy.writeFile('signup-info.json', signupResults);
    });
  });
});
