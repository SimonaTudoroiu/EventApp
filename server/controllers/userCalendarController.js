const { Op } = require("sequelize");

const UserCalendar = require('../models/userCalendar');
const Event = require('../models/event');
const Location = require('../models/location');

const deleteUserCalendar = async (req, res) => {
    const { id } = req.user.id;

    try{
        const userCalendar = await UserCalendar.findOne({
            where: {
                user_id: id
            }
        });
        await UserCalendar.destroy({
            where: {
                calendar_id: id
            }
        });


        res.status(200).json({
            success: true,
            message: "User Calendar deleted"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error deleting user calendar",
            data: err
        });
    }
}

const getUserCalendar = async (req, res) => {
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
        const { count, rows } = await UserCalendar.findAndCountAll({
            where: where,
            limit: limit,
            offset: offset,
            order: sortOrder
        });

        if (count === 0) {
            return res.status(200).json({
                success: true,
                message: "No events found in the user calendar",
                data: [],
                total: 0,
                currentPage: page ? +page : 0,
                totalPages: 0
            });
        }

        res.status(200).json({
            success: true,
            message: "Events found in the user calendar",
            data: rows,
            total: count,
            currentPage: page ? +page : 0,
            totalPages: Math.ceil(count / limit)
        });

    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding user calendar",
            data: err
        });
    }
};

const getUserCalendarById = async (req, res) => {
    const id = req.user.id;

    try{
        const userCalendar = await UserCalendar.findOne({
            where: {
                user_id: id
            }
        });

        res.status(200).json({
            success: true,
            message: "User Calendar found",
            data: userCalendar
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding user calendar",
            data: err
        });
    }
};

const getEventsFromCalendar = async (req, res) => {
    const id = req.user.id;

    try{
        const userCalendar = await UserCalendar.findOne({
            where: {
                user_id: id
            }
        });

        console.log(userCalendar)
       
        const events = await userCalendar.getEvents({
            attributes: ['event_id', 'name', 'description', 'start_date', 'end_date', 'image'],
            include: [{
                model: Location,
                required: false,  // Schimbă în true dacă vrei să returnezi doar evenimentele care au o locație
                attributes: ['name', 'address']
            }],
        });
        // console.log(events[0].name, events[1].name)
        res.status(200).json({
            success: true,
            message: "Events found in the user calendar",
            data: events
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding events in user calendar",
            data: err
        });
    }

}
module.exports = {
    deleteUserCalendar,
    getUserCalendar,
    getUserCalendarById,
    getEventsFromCalendar
};