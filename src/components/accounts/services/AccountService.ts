import { sendMail } from 'services/nodemailer';

import { getLogger } from '../../../utils';
import changePasswordTemplate from '../templates/ChangePasswordTemplate';
import verifyEmailTemplate from '../templates/VerifyEmailTemplate';
import { AccountEvents } from '../workers/AccountWorker';

const logger = getLogger('AccountService');

export const createHandler = async (
  event: AccountEvents[keyof AccountEvents],
  payload: { email: string; token: string; otp: string },
) => {
  const subject = 'Verify your email';
  const body = verifyEmailTemplate(payload.otp);
  // TODO: Send verification Email

  return sendMail(payload.email, subject, body);
};

export const updateHandler = async (event: AccountEvents[keyof AccountEvents], payload: any) => {
  logger.info(event, payload);
};

export const deleteHandler = async (event: AccountEvents[keyof AccountEvents], payload: any) => {
  logger.info(event, payload);
};

export const recoveryHandler = async (event: AccountEvents[keyof AccountEvents], payload: any) => {
  const subject = 'Change your password';
  const body = changePasswordTemplate(payload.token);

  return [subject, body, event, payload];
};

export const inviteHandler = async (event: AccountEvents[keyof AccountEvents], payload: any) => {
  logger.info(event, payload);
};
