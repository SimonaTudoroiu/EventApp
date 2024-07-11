const joi = require('joi');

const userCalendarSchema = joi.object({
    user_id: joi.string().guid({ version: 'uuidv4' }),
    number_of_events: joi.number().integer().required(),
});

const validateUserCalendar = (req, res, next) => {
    const { error } = userCalendarSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = validateUserCalendar;