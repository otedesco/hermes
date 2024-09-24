import nodemailer from 'nodemailer';

import { SENDER_EMAIL, SENDER_PASSWORD } from '../configs/AppConfig';
import { getLogger } from '../utils/Logger';

const logger = getLogger('AccountWorker');

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    },
  });
};

export const sendMail = (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: SENDER_EMAIL,
    to,
    subject,
    text,
  };
  const transporter = getTransporter();

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info(info);
    }
  });
};
