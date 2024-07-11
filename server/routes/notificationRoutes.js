const express = require('express');
const notificationController = require('../controllers/notificationController');

const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateNotification = require('../middlewares/validateBody/validateNotification');

const router = express.Router();

router.post('/save-notification', [verifyToken, verifyRole(['administrator']), validateNotification],notificationController.saveNotification);

router.put('/update-notification', [verifyToken, verifyRole(['administrator']), validateNotification], notificationController.updateNotification);

router.delete('/delete-notification', [verifyToken, verifyRole(['administrator'])], notificationController.deleteNotification);

router.get('/get-all-notification', [verifyToken, verifyRole(['administrator', 'user'])], notificationController.getNotifications);

router.get('/get-notification', [verifyToken, verifyRole(['administrator', 'user'])],  notificationController.getNotificationById);

module.exports = router;

