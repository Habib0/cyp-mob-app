require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require('fs');

// Set SendGrid API key from .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Read report data
const results = JSON.parse(fs.readFileSync('./signup-info.json', 'utf8'));

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

// Create email message
const msg = {
  to: process.env.REPORT_RECEIVER_EMAIL,   // ✅ Must be real and accessible
  from: process.env.SENDER_EMAIL,          // ✅ Use authenticated domain (not Gmail/Yahoo)
  subject: '✅ Signup/Sigin Test Report: 10 Emails Verified',
  text: `Test Completed (10 Signups)\n\n${textList}`,
  html: `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
      <h2>✅ Test Completed (10 Signups)</h2>
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
