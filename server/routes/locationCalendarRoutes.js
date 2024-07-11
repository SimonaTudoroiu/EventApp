const express = require('express');
const locationCalendarController = require('../controllers/locationCalendarController');

const router = express.Router();

router.delete('/delete-locationCalendar', locationCalendarController.deleteLocationCalendar);

router.get('/get-all-locationCalendar', locationCalendarController.getLocationCalendar);

router.get('/get-locationCalendar',  locationCalendarController.getLocationCalendarById);    

module.exports = router;