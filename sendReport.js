require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require('fs');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const data = JSON.parse(fs.readFileSync('./signup-info.json', 'utf8'));

const msg = {
  to: process.env.REPORT_RECEIVER_EMAIL,
  from: process.env.SENDER_EMAIL,
  subject: 'Cypress Test Passed - Signup Email Info',
  html: `
    <h2>✅ Cypress Test Completed</h2>
    <p><strong>Signup Email:</strong> ${data.signupEmail}</p>
    <p><strong>Status:</strong> ${data.message}</p>
    <p><strong>Time:</strong> ${data.timestamp}</p>
  `
};

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully to client.');
  })
  .catch((error) => {
    console.error('SendGrid Error:', error);
    process.exit(1); // Fail pipeline if email fails
  });
