type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const IS_PROD = process.env.NODE_ENV === 'production';
const FORCE_DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';

const shouldLog = () => !IS_PROD || FORCE_DEBUG;

export const logger = {
  info: (...args: any[]) => {
    if (shouldLog()) console.info(...args);
  },
  warn: (...args: any[]) => {
    if (shouldLog()) console.warn(...args);
  },
  error: (...args: any[]) => {
    if (shouldLog()) console.error(...args);
  },
  debug: (...args: any[]) => {
    if (shouldLog()) console.debug(...args);
  },
  log: (...args: any[]) => {
    if (shouldLog()) console.log(...args);
  }
};
