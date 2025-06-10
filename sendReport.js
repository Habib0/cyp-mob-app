require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require('fs');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Correct file path
const results = JSON.parse(fs.readFileSync('./cypress/signup-info.json', 'utf8'));

// Build HTML and text content
const htmlList = results.map((r, i) => `
  <li>
    <strong>Email ${i + 1}:</strong> ${r.signupEmail}<br/>
    <strong>Status:</strong> ${r.message}<br/>
    <strong>Time:</strong> ${r.timestamp}
  </li>
`).join('');

const textList = results.map((r, i) =>
  `Email ${i + 1}: ${r.signupEmail}\nStatus: ${r.message}\nTime: ${r.timestamp}\n`
).join('\n');

// Email content
const msg = {
  to: process.env.REPORT_RECEIVER_EMAIL,
  from: process.env.SENDER_EMAIL,
  subject: `✅ Signup/Sign-in Test Report: ${results.length} Emails Verified`,
  text: `Test Completed (${results.length} Signups)\n\n${textList}`,
  html: `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
      <h2>✅ Automated Test Completed (${results.length} Signups)</h2>
      <ul>${htmlList}</ul>
    </div>
  `
};

// Send email
sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email report sent to client.');
  })
  .catch((error) => {
    console.error('❌ SendGrid Error:', error.response ? error.response.body : error);
    process.exit(1);
  });
