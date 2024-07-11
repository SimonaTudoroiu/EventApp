const express = require('express');
const multer = require('multer');
const administratorController = require('../controllers/administratorController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateAdministrator = require('../middlewares/validateBody/validateAdministrator');

const router = express.Router();

router.post('/register',validateAdministrator, administratorController.saveAdministrator);

router.put('/update',[verifyToken, verifyRole(['administrator']), validateAdministrator], administratorController.updateAdministrator);

router.delete('/delete', [verifyToken, verifyRole(['administrator'])], administratorController.deleteAdministrator);

router.post('/login',validateAdministrator, administratorController.loginAdministrator); 

router.post('/upload', upload.array('photos'), administratorController.uploadImages);

// router.post('/trimite-cod', administratorController.trimiteCod);

router.post('/forgot-password', administratorController.requestPasswordReset);

router.post('/reset-password', administratorController.resetPassword);

module.exports = router;