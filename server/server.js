const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Booking routes
app.use('/api/bookings', bookingRoutes);
// app.use(paymentRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
