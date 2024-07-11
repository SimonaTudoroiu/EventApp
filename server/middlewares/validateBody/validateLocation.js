const joi = require('joi');

const locationSchema = joi.object({
    location_id : joi.string().guid({ version: 'uuidv4' }),
    admin_id : joi.string().guid({ version: 'uuidv4' }),
    name: joi.string(),
    address: joi.string(),
    latitude: joi.number().min(-90).max(90),
    longitude: joi.number().min(-180).max(180),
    description: joi.string().default(null).allow(null),
    review_summary: joi.number().default(0),
});

const validateLocation = (req, res, next) => {
    const { error } = locationSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = validateLocation;