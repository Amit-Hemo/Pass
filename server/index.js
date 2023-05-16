const { default: mongoose } = require('mongoose');
const PORT = process.env.PORT || 5000;
const app = require('./app');

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`server listening on ${PORT}`));
});
