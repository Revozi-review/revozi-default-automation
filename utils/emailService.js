const logger = require('./logger');
const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing (SMTP_HOST, SMTP_USER, SMTP_PASS)');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  return transporter;
}

async function sendEmail(to, subject, text) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  try {
    const tx = getTransporter();
    const info = await tx.sendMail({ from, to, subject, text });
    logger.info(`[EMAIL] Sent message id=${info.messageId} to=${to}`);
    return { success: true, id: info.messageId };
  } catch (err) {
    logger.error(`[EMAIL] Send failed: ${err.message}`);
    throw err;
  }
}

module.exports = { sendEmail };


