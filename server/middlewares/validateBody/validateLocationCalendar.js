const joi = require('joi');

const locationCalendarSchema = joi.object({
    location_id : joi.string().guid({ version: 'uuidv4' }),
    event_id : joi.string().guid({ version: 'uuidv4' }),
    date_added: joi.date()
});

const validateLocationCalendar = (req, res, next) => {
    const { error } = locationCalendarSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = validateLocationCalendar;