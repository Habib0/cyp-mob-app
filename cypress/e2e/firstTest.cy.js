describe('template spec', () => {
  it('passes', () => {
    cy.api({
      method: 'POST',
      url: 'https://uptickerbe.xeventechnologies.com/api/auth/check-email',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: {
        email: "test01@getnada.com",
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.log(`Status: ${response.status}`);
      expect(response.body.responseCode).to.eq(201);
    });
    
  })

  
})