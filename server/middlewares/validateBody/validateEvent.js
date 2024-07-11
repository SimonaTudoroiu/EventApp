const joi = require('joi');

const eventSchema = joi.object({
    event_id: joi.string().guid({ version: 'uuidv4' }),
    location_id : joi.string().guid({ version: 'uuidv4' }),
    name: joi.string(),
    start_date: joi.date(),
    end_date: joi.date(),
    description: joi.string(),
    available_spots: joi.number().integer(),
    reserved_spots: joi.number().integer(),
    review_summary: joi.number().default(0),
    category: joi.string(),
    price: joi.number().default(0)
});

const validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = validateEvent;