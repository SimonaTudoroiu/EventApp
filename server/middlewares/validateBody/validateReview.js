const joi = require('joi');

const reviewSchema = joi.object({
    review_id: joi.string().guid({ version: 'uuidv4' }),
    user_id: joi.string().guid({ version: 'uuidv4' }),
    event_id: joi.string().guid({ version: 'uuidv4' }),
    rating: joi.number().integer().min(1).max(5),
    comment: joi.string().default(null),
    review_date: joi.date()
});

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if(error){
        console.log('error', error);
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = validateReview;