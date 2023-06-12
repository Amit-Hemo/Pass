const { format, transports, createLogger } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, json, printf, colorize, simple } = format;

const errorFilter = format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = format((info, opts) => {
  return info.level === 'info' ? info : false;
});

const httpFilter = format((info, opts) => {
  return info.level === 'http' ? info : false;
});

const createLoggerInstance = (service = 'general-purpose') => {
  const logger = createLogger({
    defaultMeta: { service },
    format: combine(
      timestamp(),
      json(),
      printf((info) => `${info.timestamp} ${info.level} ${info.message}`)
    ),
    level: 'http',
    transports: [
      new transports.Console(),
      new DailyRotateFile({
        level: 'http',
        filename: 'logs/http-%DATE%.log',
        format: combine(httpFilter(), timestamp(), json()),
        zippedArchive: true,
        datePattern: 'DD-MM-YYYY',
        maxFiles: '14d',
      }),
      new DailyRotateFile({
        level: 'info',
        filename: 'logs/info-%DATE%.log',
        format: combine(infoFilter(), timestamp(), json()),
        zippedArchive: true,
        datePattern: 'DD-MM-YYYY',
        maxFiles: '14d',
      }),
      new DailyRotateFile({
        level: 'error',
        filename: 'logs/errors-%DATE%.log',
        format: combine(errorFilter(), timestamp(), json()),
        zippedArchive: true,
        datePattern: 'DD-MM-YYYY',
        maxFiles: '14d',
      }),
    ],
  });
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        format: combine(colorize({ colors: { http: 'magenta' } }), simple()),
      })
    );
  }
  return logger;
};

module.exports = createLoggerInstance;
