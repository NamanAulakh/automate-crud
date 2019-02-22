import winston, { transports, createLogger, format } from 'winston';
require('winston-mongodb');
import { host } from './app';
import CustomTransport from './customTransport';
import moment from 'moment-timezone';
const timezoneUS = 'America/New_York';
moment.tz.setDefault(timezoneUS);

// custom transport
const transport = new CustomTransport();
// custom format
const alignedWithColorsAndTime = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(info => {
    const { timestamp, level, message, ...args } = info;
    // const ts = timestamp.slice(0, 19).replace('T', ' ');
    const ts = moment().format('ddd, MMM Do YY, h:mm:ss a');
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
    }`;
  })
);
// returns default logger
const log = () =>
  createLogger({
    format: alignedWithColorsAndTime,
    transports: [
      transport,
      new winston.transports.MongoDB({ level: 'error', collection: 'logs', db: host }),
    ],
    exceptionHandlers: [new transports.File({ filename: 'exceptions.log' })],
    humanReadableUnhandledException: true,
    exitOnError: false,
  });

// set global vars
const setGlobals = ({ logger }) => {
  const monitorLogger = createLogger({
    format: alignedWithColorsAndTime,
    transports: [
      new winston.transports.MongoDB({ level: 'silly', collection: 'monitor', db: host }),
    ],
  });
  const globalsObj = {
    yo: 'Yo',
    log: ({ level = 'info', val, extra = '', meta = undefined }) =>
      logger[level]({
        message: extra ? `${JSON.stringify(val)} <--> ${extra}` : val,
        meta,
      }),
    monitor: ({ message = '', meta = {} }) => monitorLogger.silly({ message, meta }),
    send: ({ data, res }) => res.send(data),
  };

  Object.keys(globalsObj).forEach(key => {
    global[key] = globalsObj[key];
  });
};

export default () => {
  const logger = log();
  // don't log to console in production
  if (process.env.NODE_ENV !== 'production') logger.add(new transports.Console());
  // setGlobals
  setGlobals({ logger });
};
