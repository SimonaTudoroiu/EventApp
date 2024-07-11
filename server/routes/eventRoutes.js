const express = require('express');
const eventController = require('../controllers/eventController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateEvent = require('../middlewares/validateBody/validateEvent');

const router = express.Router();

router.post('/save-event',[verifyToken, verifyRole(['administrator']), validateEvent],  eventController.saveEvent);
// router.post('/save-event', eventController.saveEvent);

router.put('/update-event',[verifyToken, verifyRole(['administrator']), validateEvent], eventController.updateEvent);

router.delete('/delete-event',[verifyToken, verifyRole(['administrator'])], eventController.deleteEvent);
// router.delete('/delete-event', eventController.deleteEvent);

router.get('/get-all-event',[verifyToken, verifyRole(['administrator', 'user'])], eventController.getEvents);

router.get('/get-event', [verifyToken, verifyRole(['administrator', 'user'])], eventController.getEvent);    

router.put('/upload-photo', [verifyToken, verifyRole(['administrator'])], upload.single('photo'), eventController.uploadPhoto);

router.get('/find-categories', [verifyToken, verifyRole(['user'])], eventController.findCategories);

router.get('/find-locations', [verifyToken, verifyRole(['administrator'])], eventController.findLocations);

router.get('/find-events-by-admin', [verifyToken, verifyRole(['administrator'])], eventController.findEventsByAdmin);

module.exports = router;