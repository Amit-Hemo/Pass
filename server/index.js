const { default: mongoose } = require('mongoose');
const PORT = process.env.PORT || 5000;
const app = require('./app');
const createLoggerInstance = require('./utils/createLoggerInstance');

const logger = createLoggerInstance()

mongoose.connection.once('open', () => {
  app.listen(PORT, () => logger.info(`server listening on ${PORT}`));
});
