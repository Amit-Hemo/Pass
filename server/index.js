require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');

const connectDB = require('./config/dbConnect');
const paymentRoutes = require('./routes/paymentRoutes');
const usersRoutes = require('./routes/usersRoutes');
const storesRoutes = require('./routes/storesRoutes');

const app = express();
connectDB();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/payment', paymentRoutes);
app.use('/users', usersRoutes);
app.use('/stores', storesRoutes);

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`server listening on ${PORT}`));
});
