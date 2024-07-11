const express = require('express');
const reservationController = require('../controllers/reservationController');

const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateReservation = require('../middlewares/validateBody/validateReservation');

const router = express.Router();

router.post('/save-reservation', [verifyToken, verifyRole(['user']), validateReservation], reservationController.saveReservation);

router.put('/update-reservation', [verifyToken, verifyRole(['user']), validateReservation], reservationController.updateReservation);

router.delete('/delete-reservation', [verifyToken, verifyRole(['user'])], reservationController.deleteReservation);

router.get('/get-all-reservation', [verifyToken, verifyRole(['administrator'])], reservationController.getReservations);

router.get('/get-reservation', [verifyToken, verifyRole(['user', 'administrator'])],  reservationController.getReservationById);

module.exports = router;

