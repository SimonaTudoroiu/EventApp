const joi = require('joi');

const administratorSchema = joi.object({
    first_name: joi.string(),
    last_name: joi.string(),
    email: joi.string().email(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

const validateAdministrator = (req, res, next) => {
    const { error } = administratorSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = validateAdministrator;