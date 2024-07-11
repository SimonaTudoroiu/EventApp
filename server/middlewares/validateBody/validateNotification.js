const joi = require('joi');

const notificationSchema = joi.object({
    notification_id: joi.string().guid({ version: 'uuidv4' }),
    event_id: joi.string().guid({ version: 'uuidv4' }),
    notification_date: joi.date(),
    message: joi.string()
});

const validateNotification = (req, res, next) => {
    const { error } = notificationSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = validateNotification;