const { Op } = require("sequelize");

const Notification = require('../models/notification');
const Event = require('../models/event');

const saveNotification = async (req, res) => {
    const notificationBody = req.body;
 
    try {
        const event = await Event.findOne({
            where: {
                event_id: notificationBody.event_id
            }
        });

        console.log("event", event)

        const date = new Date();

        if(date <= event.start_date || date >= event.end_date)
        {
            return res.status(400).json({
                success: false,
                message: "Notification date must be between event start and end date"
            });
        }

        const notification = await Notification.create(notificationBody);

        res.status(200).json({
            success: true,
            message: "Notification created successfully",
            data: notification
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error creating notification",
            data: err
        });
    }
}

const updateNotification = async (req, res) => {
    const newBody = req.body;

    try{
        const notification = await Notification.findOne({
            where: {
                notification_id: newBody.notification_id
            }
        });

        const event = await Event.findOne({
            where: {
                event_id: notification.event_id
            }
        });

        const date = new Date();

        if(date <= event.start_date || date >= event.end_date)
        {
            return res.status(400).json({
                success: false,
                message: "Notification date must be between event start and end date"
            });
        }

        await Notification.update(newBody, {
            where: {
                notification_id: newBody.notification_id
            }
        });

        res.status(200).json({
            success: true,
            message: "Notification updated successfully",
            data: notification
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error updating notification",
            data: err
        });
    }
}

const deleteNotification = async (req, res) => {
    const { id } = req.query;

    try {
        await Notification.destroy({
            where: {
                notification_id: id
            }
        });

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error deleting notification",
            data: err
        });
    }
}

const getNotifications = async (req, res) => {
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
        const {count, rows} = await Notification.findAndCountAll({
            where: where,
            limit: limit,
            offset: offset,
            order: sortOrder
        });

        if (count === 0) {
            return res.status(200).json({
                success: true,
                message: "No notifications found",
                data: [],
                total: 0,
                currentPage: page ? +page : 0,
                totalPages: 0
            });
        }

        res.status(200).json({
            success: true,
            message: "Notifications found",
            data: rows,
            total: count,
            currentPage: page ? +page : 0,
            totalPages: Math.ceil(count / limit)
        });

    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding notifications",
            data: err
        });
    }
}

const getNotificationById = async (req, res) => {
    const {id} = req.query;

    try {
        const notification = await Notification.findOne({
            where: {
                notification_id: id
            }
        });

        res.status(200).json({
            success: true,
            message: "Notification retrieved successfully",
            data: notification
        });

    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error retrieving notification",
            data: err
        });
    }
}

module.exports = {
    saveNotification,
    updateNotification,
    deleteNotification,
    getNotifications,
    getNotificationById
}
