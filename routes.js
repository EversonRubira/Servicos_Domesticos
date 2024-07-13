const express = require('express');
const router = express.Router();
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
