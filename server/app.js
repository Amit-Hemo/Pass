require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');

const connectDB = require('./config/dbConnect');
const paymentRoutes = require('./routes/paymentRoutes');
const usersRoutes = require('./routes/usersRoutes');
const storesRoutes = require('./routes/storesRoutes');

const app = express();
connectDB();

app.use(compression());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/payment', paymentRoutes);
app.use('/users', usersRoutes);
app.use('/stores', storesRoutes);

module.exports = app