const { Op } = require("sequelize");

const Location = require('../models/location');

const saveLocation = async (req, res) => {
    const locationBody = req.body;

    try {
        console.log("Location body", locationBody)
        const location = await Location.create({
            admin_id: req.user.id,
            ...locationBody
        });

        res.status(200).json({
            success: true,
            message: "Location created successfully",
            data: location
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error creating location",
            data: err
        });
    }
}

const updateLocation = async (req, res) => {
    const newBody = req.body;

    try{
        const location = await Location.update(newBody, {
            where: {
                location_id: newBody.location_id
            }
        });

        res.status(200).json({
            success: true,
            message: "Location updated"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error updating location",
            data: err
        });
    }
};

const deleteLocation = async (req, res) => {
    const { id } = req.query;

    try{
        const location = await Location.destroy({
            where: {
                location_id: id
            }
        });

        res.status(200).json({
            success: true,
            message: "Location deleted"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error deleting location",
            data: err
        });
    }
};  

const getLocation = async (req, res) => {
    try{
        const location = await Location.findAll(
            {
                where: {
                    admin_id: req.user.id
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "Location found",
            data: location
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding location",
            data: err
        });
    }
};

const getLocationById = async (req, res) => {
    const {id} = req.query;

    try{
        const location = await Location.findOne({
            where: {
                location_id: id
            }
        });

        res.status(200).json({
            success: true,
            message: "Location found",
            data: location
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding location",
            data: err
        });
    }
};

module.exports = {
    saveLocation,
    updateLocation,
    deleteLocation,
    getLocation,
    getLocationById
}