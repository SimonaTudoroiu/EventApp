const express = require('express');
const userController = require('../controllers/userController');

const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateUser = require('../middlewares/validateBody/validateUser');

const router = express.Router();

router.post('/register', validateUser, userController.saveUser);

router.put('/update', [ verifyToken, verifyRole(['user']), validateUser], userController.updateUser);

router.delete('/delete',[verifyToken, verifyRole(['user'])], userController.deleteUser);

// router.get('/byPreference', userController.getUserByPreference);

router.post('/login', userController.loginUser);    

router.post('/forgot-password', userController.requestPasswordReset);

router.post('/reset-password', userController.resetPassword);

module.exports = router;