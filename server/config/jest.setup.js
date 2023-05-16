const { default: mongoose } = require("mongoose");

afterAll(async () => {
  console.log('closing connection');
  await mongoose.connection.close();
});