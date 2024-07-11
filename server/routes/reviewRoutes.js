const express = require('express');
const reviewController = require('../controllers/reviewController');

const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateReview = require('../middlewares/validateBody/validateReview');

const router = express.Router();

router.post('/save-review', [verifyToken, verifyRole(['user']), validateReview], reviewController.saveReview);

router.put('/update-review', [verifyToken, verifyRole(['user']), validateReview], reviewController.updateReview);

router.delete('/delete-review', [verifyToken, verifyRole(['user'])], reviewController.deleteReview);

router.get('/get-all-review', [verifyToken, verifyRole(['user', 'administrator'])], reviewController.getReviews);

router.get('/get-review', [verifyToken, verifyRole(['user', 'administrator'])],  reviewController.getReviewById);

module.exports = router;

