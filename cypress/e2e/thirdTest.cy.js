const apiBaseUrl = Cypress.env('apiBaseUrl');
const verifyUserEndpoint = Cypress.env('verifyUserEndpoint');
const checkEmailEndpoint = Cypress.env('checkEmailEndpoint');

describe('Email verification and login link test', () => {
  let emailAddress;
  let inboxId;

  before(() => {
    cy.mailslurp().then(mailslurp => 
      mailslurp.createInbox().then(inbox => {
        inboxId = inbox.id;
        emailAddress = inbox.emailAddress;
        cy.wrap(inboxId).as('inboxId');
        cy.wrap(emailAddress).as('emailAddress');
        cy.log(`Created inbox: ${emailAddress}`);
      })
    );
  });

 it('Should trigger signup email and click Login Now link', function () {
  cy.get('@emailAddress').then((email) => {
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}${checkEmailEndpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: { email },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.eq('Record saved successfully.');
      expect(res.body.data).to.include('Email with login link sent successfully');
      cy.log('Signup Response:', JSON.stringify(res.body));
    });
  });

  cy.get('@inboxId').then((inboxId) => {
    cy.mailslurp().then(mailslurp => {
      // ✅ RETURN the promise to ensure Cypress waits
      return mailslurp.waitForLatestEmail(inboxId, 30000, true).then(email => {
        expect(email.subject).to.include('Login');

        const html = document.createElement('html');
        html.innerHTML = email.body;

        const linkElement = Array.from(html.querySelectorAll('a')).find(a => a.textContent.includes('Login Now'));
        const loginUrl = linkElement?.getAttribute('href');

        cy.log('Extracted Login URL:', loginUrl);
        expect(loginUrl).to.contain('elasticemail');

        cy.visit(loginUrl);
        cy.url().should('include', '/verify/').then((currentUrl) => {
        const token = currentUrl.split('/verify/')[1];
        cy.log('Extracted Token:', token);
        cy.wrap(token).as('userToken'); // Store for later use
        });
        });
      });
    });

    // Now use the extracted token in verify API
    cy.get('@userToken').then((userToken) => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}${verifyUserEndpoint}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: {
          userToken: userToken,
          fcmToken: null
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq('Record saved successfully.');
        expect(res.body.data).to.have.property('email');
        cy.log('Verification Response:', JSON.stringify(res.body));
        cy.log('login link clicked and verified successfully');
      });
    });
    cy.get('@emailAddress').then((email) => {
  cy.writeFile('signup-info.json', {
    signupEmail: email,
    message: 'Signup via email, link receive in email then verified and login successfully.',
    timestamp: new Date().toISOString()
  });
});

  });
});

