const express = require('express');
const userCalendarController = require('../controllers/userCalendarController');

const router = express.Router();

router.delete('/delete-userCalendar', userCalendarController.deleteUserCalendar);

router.get('/get-all-userCalendar', userCalendarController.getUserCalendar);

router.get('/get-userCalendar',  userCalendarController.getUserCalendarById);  

router.get('/get-events', userCalendarController.getEventsFromCalendar);

module.exports = router;