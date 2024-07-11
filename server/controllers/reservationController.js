const { Op, where } = require("sequelize");

const Reservation = require('../models/reservation');
const UserCalendar = require('../models/userCalendar');
const Event = require('../models/event');
const User = require('../models/user');
const saveReservation = async (req, res) => {
    const reservationBody = req.body;

    console.log("reservationBody", reservationBody)

    const event  = await Event.findOne({
        where: {
            event_id: reservationBody.event_id
        }
    });

    if(event.available_spots < reservationBody.num_of_seats){
        return res.status(400).json({
            success: false,
            message: "Not enough available spots"
        });
    }
    
    try {
        const reservation = await Reservation.create({
            user_id: req.user.id,
            ...reservationBody,
            reservation_date: new Date()
            });

        


        const eventNewBody = {
            available_spots: event.available_spots - reservation.num_of_seats,
            reserved_spots: event.reserved_spots + reservation.num_of_seats
        };

        
        const eventUpdated = await Event.update(eventNewBody, {
            where: {
                event_id: reservation.event_id
            }
        });


        const userCalendar = await UserCalendar.findOne({
            where: {
                user_id: reservation.user_id
            }
        });

        await event.addUserCalendar(userCalendar);

        
        await UserCalendar.update({
            number_of_events: userCalendar.number_of_events + 1
        }, 
        {
            where: {
                user_id: req.user.id
            }
        })

        res.status(200).json({
            success: true,
            message: "Reservation created successfully",
            data: reservation
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error creating reservation",
            data: err
        });
    }
}
const updateReservation = async (req, res) => {
    const newBody = req.body;

    try{
        const oldReservation = await Reservation.findOne({
            where: {
                reservation_id: newBody.reservation_id
            }
        });

        await Reservation.update(newBody, {
            where: {
                reservation_id: newBody.reservation_id
            }
        });

        if(newBody.num_of_seats){
            const event  = await Event.findOne({
                where: {
                    event_id: oldReservation.event_id
                }
            });


            if(newBody.num_of_seats > oldReservation.num_of_seats){
                const eventNewBody ={
                    available_spots: event.available_spots - (newBody.num_of_seats - oldReservation.num_of_seats),
                    reserved_spots: event.reserved_spots + (newBody.num_of_seats - oldReservation.num_of_seats)
                }
                
                await Event.update(eventNewBody, {
                    where: {
                        event_id: event.event_id
                    }
                });
            }
            else{
                const eventNewBody ={
                    available_spots: event.available_spots + (oldReservation.num_of_seats - newBody.num_of_seats),
                    reserved_spots: event.reserved_spots - (oldReservation.num_of_seats - newBody.num_of_seats)
                }
                await Event.update(eventNewBody, {
                    where: {
                        event_id: event.event_id
                    }
                });
            }

            res.status(200).json({
                success: true,
                message: "Reservation updated"
            });
        }
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error updating reservation",
            data: err
        });
    }
}


const deleteReservation = async (req, res) => {
    const { id } = req.query;

    try{
        const reservation = await Reservation.findOne({
            where: {
                reservation_id: id
            }
        });

        await Reservation.destroy({
            where: {
                reservation_id: id
            }
        });


        const event  = await Event.findOne({
            where: {
                event_id: reservation.event_id
            }
        });


        const userCalendar = await UserCalendar.findOne({
            where: {
                user_id: reservation.user_id
            }
        });

        
        await event.removeUserCalendar(userCalendar);

        await UserCalendar.update({
            number_of_events: userCalendar.number_of_events - 1
        }, 
        {
            where: {
                user_id: req.user.id
            }
        })

        const eventNewBody = {
            available_spots: event.available_spots + reservation.num_of_seats,
            reserved_spots: event.reserved_spots - reservation.num_of_seats
        };

        await Event.update(eventNewBody, {
            where: {
                event_id: event.event_id
            }
        });

        res.status(200).json({
            success: true,
            message: "Reservation deleted"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error deleting reservation",
            data: err
        });
    }
};

const getReservations = async (req, res) => {
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
        const {count, rows} = await Reservation.findAndCountAll({
            where: where,
            limit: limit,
            offset: offset,
            order: sortOrder,
            include: [{
                model: User,
                required: false
            }]
        });

        if (count === 0) {
            return res.status(200).json({
                success: true,
                message: "No reservations found",
                data: [],
                total: 0,
                currentPage: page ? +page : 0,
                totalPages: 0
            });
        }

        res.status(200).json({
            success: true,
            message: "Reservations found",
            data: rows,
            total: count,
            currentPage: page ? +page : 0,
            totalPages: Math.ceil(count / limit)
        });

    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding reservations",
            data: err
        });
    }
};

const getReservationById = async (req, res) => {
    const {id} = req.query;

    try{
        const reservation = await Reservation.findOne({
            where: {
                reservation_id: id
            }
        });

        res.status(200).json({
            success: true,
            message: "Reservation found",
            data: reservation
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding reservation",
            data: err
        });
    }
};

module.exports = {
    saveReservation,
    updateReservation,
    deleteReservation,
    getReservations,
    getReservationById
};