const joi = require('joi');

const reservationSchema = joi.object({
    reservation_id: joi.string().guid({ version: 'uuidv4' }),
    user_id: joi.string().guid({ version: 'uuidv4' }),
    event_id: joi.string().guid({ version: 'uuidv4' }),
    num_of_seats: joi.number().integer(),
    reservation_date: joi.date(),
    description: joi.string().allow('').default(null)
});

const validateReservation = (req, res, next) => {
    const { error } = reservationSchema.validate(req.body);

    if(error){
        console.log("error", error)
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = validateReservation;