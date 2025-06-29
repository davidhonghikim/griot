/**
 * Logging Utility
 * Structured logging for the Griot framework
 */

import { getEnvironmentConfig } from '../../config/environment.js';

const env = getEnvironmentConfig();

export function createLogger(name: string) {
  const logLevel = env.LOG_LEVEL || 'info';
  const isProd = env.NODE_ENV === 'production';

  return {
    info: (...args: any[]) => {
      if (logLevel === 'info' || logLevel === 'debug') {
        // eslint-disable-next-line no-console
        console.log(`[INFO][${name}]`, ...args);
      }
    },
    debug: (...args: any[]) => {
      if (logLevel === 'debug' && !isProd) {
        // eslint-disable-next-line no-console
        console.debug(`[DEBUG][${name}]`, ...args);
      }
    },
    warn: (...args: any[]) => {
      // eslint-disable-next-line no-console
      console.warn(`[WARN][${name}]`, ...args);
    },
    error: (...args: any[]) => {
      // eslint-disable-next-line no-console
      console.error(`[ERROR][${name}]`, ...args);
    },
  };
}

// Create a default logger instance
const baseLogger = createLogger('griot-core');

export { baseLogger as logger }; 