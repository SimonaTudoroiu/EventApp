const { Op } = require("sequelize");

const LocationCalendar = require('../models/locationCalendar');
const Event = require('../models/event');

const deleteLocationCalendar = async (req, res) => {
    const { id } = req.query;

    try{
        const locationCalendar = await LocationCalendar.findOne({
            where: {
                calendar_id: id
            }
        });
        await LocationCalendar.destroy({
            where: {
                calendar_id: id
            }
        });

        const event_id = locationCalendar.event_id;
        const event = await Event.destroy({
            where: {
                event_id: event_id
            }
        });


        res.status(200).json({
            success: true,
            message: "Location Calendar deleted"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error deleting location calendar",
            data: err
        });
    }
}

const getLocationCalendar = async (req, res) => {
    let { page, size, sort, order, ...filterParams } = req.query;
    const limit = size ? +size : 10;  // Numărul de evenimente pe pagină
    const offset = page ? page * limit : 0;  // Calculul offsetului pentru paginare
    const sortOrder = sort && order ? [[sort, order]] : [['createdAt', 'DESC']];  // Ordonare implicită

    // Construiește condiții de filtrare din parametrii rămași
    const where = {};
    Object.keys(filterParams).forEach(key => {
        where[key] = filterParams[key];
    });

    try{
        const { count, rows } = await LocationCalendar.findAndCountAll({
            where: where,
            limit: limit,
            offset: offset,
            order: sortOrder,
            include: [{
                model: Event,
                required: false
            }]
        });

        if (count === 0) {
            return res.status(200).json({
                success: true,
                message: "No events found in the location calendar",
                data: [],
                total: 0,
                currentPage: page ? +page : 0,
                totalPages: 0
            });
        }

        res.status(200).json({
            success: true,
            message: "Events found in the location calendar",
            data: rows,
            total: count,
            currentPage: page ? +page : 0,
            totalPages: Math.ceil(count / limit)
        });

    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding location calendar",
            data: err
        });
    }
};

const getLocationCalendarById = async (req, res) => {
    const {id} = req.query;

    try{
        const locationCalendar = await LocationCalendar.findOne({
            where: {
                calendar_id: id
            }
        });

        res.status(200).json({
            success: true,
            message: "Location Calendar found",
            data: locationCalendar
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding location calendar",
            data: err
        });
    }
};

module.exports = {
    deleteLocationCalendar,
    getLocationCalendar,
    getLocationCalendarById
};