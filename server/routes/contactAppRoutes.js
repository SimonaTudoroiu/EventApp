const express = require('express');
const contactAppController = require('../controllers/contactAppController');

const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateEvent = require('../middlewares/validateBody/validateEvent');

const router = express.Router();

router.post('/send-email',[verifyToken, verifyRole(['administrator', 'user'])], contactAppController.sendEmail);

module.exports = router;