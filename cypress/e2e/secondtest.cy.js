describe('Daily check for sign-up and sign-in via check-email API', () => {
  const emailPrefix = `test_user_${Date.now()}`;
  const testEmail = `${emailPrefix}@getnada.com`;

  it('should sign up a new user and then sign in with the same user', () => {
    // 1. Sign up - first call with a new email
    cy.api({
      method: 'POST',
      url: 'https://uptickerbe.xeventechnologies.com/api/auth/check-email',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: {
        email: testEmail,
      },
      failOnStatusCode: false,
    }).then((signupResponse) => {
      cy.log(`Signup Response: ${JSON.stringify(signupResponse.body)}`);
      // ✅ Sign up assertions
      expect(signupResponse.status).to.eq(201); // HTTP status (corrected)
      expect(signupResponse.body.statusCode).to.eq(201); // API statusCode
      expect(signupResponse.body.message).to.eq('Record saved successfully.');
      expect(signupResponse.body.data).to.contain('Email with login link sent successfully');

    })
  });
});
