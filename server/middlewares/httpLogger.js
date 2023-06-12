const morgan = require('morgan');
const createLoggerInstance = require('../utils/createLoggerInstance');

const httpLogger = (service = 'unknown') => {
  const logger = createLoggerInstance(service);
  const stream = {
    write: (message) => logger.http('INCOMING-REQUEST',JSON.parse(message.trim())),
  };

  return morgan(
    function (tokens, req, res) {
      return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: Number.parseFloat(tokens.status(req, res)),
        content_length: tokens.res(req, res, 'content-length'),
        response_time: Number.parseFloat(tokens['response-time'](req, res)),
      });
    },
    {
      stream,
    }
  );
};

module.exports = httpLogger;
