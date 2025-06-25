/**
 * Logging Utility
 * Structured logging for the Griot framework
 */

import { pino } from 'pino';

const baseLogger = pino(
  process.env.NODE_ENV !== 'production' 
    ? {
        level: process.env.LOG_LEVEL || 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
          }
        }
      }
    : {
        level: process.env.LOG_LEVEL || 'info'
      }
);

export function createLogger(name: string) {
  return baseLogger.child({ component: name });
}

export { baseLogger as logger }; 