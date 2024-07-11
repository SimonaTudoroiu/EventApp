const joi = require('joi');

const userSchema = joi.object({
    first_name: joi.string(),
    last_name: joi.string(),
    email: joi.string().email(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);

    if(error){
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = validateUser;