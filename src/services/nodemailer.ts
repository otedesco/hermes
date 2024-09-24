import { validate as validateEmail } from 'email-validator';
import nodemailer from 'nodemailer';

import { EMAIL_SERVICE, SENDER_EMAIL, SENDER_PASSWORD } from '../configs/AppConfig';
import { getLogger } from '../utils/Logger';

const logger = getLogger('EmailService');
let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
    });
  }

  return transporter;
};

export const sendMail = async (to: string, subject: string, text: string): Promise<void> => {
  if (!validateEmail(to)) {
    throw new Error('Invalid recipient email address');
  }
  if (!subject || subject.trim().length === 0) {
    throw new Error('Subject cannot be empty');
  }
  if (!text || text.trim().length === 0) {
    throw new Error('Email body cannot be empty');
  }

  const mailOptions = {
    from: SENDER_EMAIL,
    to,
    subject,
    text,
  };

  const transporterInstance = getTransporter();

  try {
    const info = await transporterInstance.sendMail(mailOptions);
    logger.info(`Email sent successfully: ${info.messageId}`);
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`, { error });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
