const express = require('express');
const generalAdministratorController = require('../controllers/generalAdminController');

const validateAdministrator = require('../middlewares/validateBody/validateAdministrator');
const { valid } = require('joi');

const router = express.Router();

router.get('/all-documents', generalAdministratorController.getDocuments);

router.post('/accept-administrator', validateAdministrator, generalAdministratorController.acceptAdministrator);

router.delete('/deny-administrator', generalAdministratorController.denyAdministrator);

module.exports = router;