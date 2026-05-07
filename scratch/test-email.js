const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Basic manual parsing of .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    env[key.trim()] = value.join('=').trim().replace(/"/g, '');
  }
});

async function main() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.GMAIL_EMAIL,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    console.log(`Sending test email from ${env.GMAIL_EMAIL}...`);
    await transporter.sendMail({
      from: env.GMAIL_EMAIL,
      to: env.GMAIL_EMAIL,
      subject: 'Test Email',
      text: 'If you see this, your Gmail config is working.',
    });
    console.log('Success!');
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

main();
