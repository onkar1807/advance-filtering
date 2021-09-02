require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./backend/config/db');
connectDB();

const errorHandler = require('./backend/middlewares/errorHandler');

// middleware
app.use(express.json());

// routes
app.use('/api/bootcamp', require('./backend/routes/routes'));

// error handler
app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
