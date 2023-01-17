const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
const paymentRoutes = require('./routes/paymentRoutes')

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/payment', paymentRoutes);

app.listen(PORT, () => console.log(`server listening on ${PORT}`))

