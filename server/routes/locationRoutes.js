const express = require('express');
const locationController = require('../controllers/locationController');

const validateLocation = require('../middlewares/validateBody/validateLocation');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');

const router = express.Router();

router.post('/save-location',[verifyToken, verifyRole(['administrator'])], validateLocation, locationController.saveLocation);

router.put('/update-location',[verifyToken, verifyRole(['administrator'])], validateLocation,  locationController.updateLocation);

router.delete('/delete-location',[verifyToken, verifyRole(['administrator'])], locationController.deleteLocation);

router.get('/get-all-locations',[verifyToken, verifyRole(['administrator', 'user'])], locationController.getLocation);

router.get('/get-location',[verifyToken, verifyRole(['administrator', 'user'])], locationController.getLocationById);    

module.exports = router;