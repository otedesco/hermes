import cluster from 'node:cluster';

import log4js from 'log4js';

import { LOG_LEVEL } from '../configs/AppConfig';

log4js.configure({
  appenders: {
    console: { type: 'console', layout: { type: 'colored' } },
  },
  categories: {
    default: { appenders: ['console'], level: LOG_LEVEL },
  },
});

export type LogLevels = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

export const getLogger = (
  loggerName: string,
): Record<string, (logs: any) => void> | log4js.Logger => {
  if (cluster.isPrimary) return log4js.getLogger(loggerName);

  return LOG_LEVELS.reduce((logger, logLevel) => {
    const log = (...logs: any) => {
      cluster.worker?.send({
        cmd: 'log',
        logLevel,
        loggerName,
        logs,
      });
    };

    return { ...logger, [logLevel]: log };
  }, {});
};

export default log4js;
