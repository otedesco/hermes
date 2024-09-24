import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const environment = process.env;

export const APP_NAME = environment.APP_NAME || 'hermes';
export const NODE_ENV = environment.NODE_ENV || 'development';
export const SERVER_PORT = +environment.SERVER_PORT! || 4000;
export const CLIENT_HOST = environment.CLIENT_HOST || 'http://localhost:3000';

export const LOG_LEVEL = environment.LOG_LEVEL || 'INFO';

export const PROMISE_CONCURRENCY = +environment.PROMISE_CONCURRENCY! || 10;

export const SENDER_EMAIL = environment.SENDER_EMAIL || '';
export const SENDER_PASSWORD = environment.SENDER_PASSWORD || '';
export const EMAIL_SERVICE = environment.EMAIL_SERVICE || 'gmail';
