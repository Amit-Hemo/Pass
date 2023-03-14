require('dotenv').config();
const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const connectDB = require('./config/dbConnect');
const { default: mongoose } = require('mongoose');

const app = express();
connectDB();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/payment', paymentRoutes);

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`server listening on ${PORT}`));
})
