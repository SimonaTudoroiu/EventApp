const { Op } = require("sequelize");
const sharp = require('sharp');

const Event = require('../models/event');
const LocationCalendar = require('../models/locationCalendar');
const Location = require('../models/location');
const saveEvent = async (req, res) => {
    const eventBody = req.body;
    console.log('eventBody', eventBody);
    try {
        const event = await Event.create({...eventBody, image: ""});

        await LocationCalendar.create({
            location_id: eventBody.location_id,
            event_id: event.event_id,
            date_added: new Date()
        });


        res.status(200).json({
            success: true,
            message: "Event created successfully",
            data: event
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error creating event",
            data: err
        });
    }
}

const updateEvent = async (req, res) => {
    const newBody = req.body;

    try{
        const event = await Event.update(newBody, {
            where: {
                event_id: newBody.event_id
            }
        });

        res.status(200).json({
            success: true,
            message: "Event updated"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error updating event",
            data: err
        });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.query;

    try{
        const event = await Event.destroy({
            where: {
                event_id: id
            }
        });

        res.status(200).json({
            success: true,
            message: "Event deleted"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error deleting event",
            data: err
        });
    }
};

const getEvents = async (req, res) => {
    let { page, size, sort, order, ...filterParams } = req.query;
    const limit = size ? +size : 10;  // Numărul de evenimente pe pagină
    const offset = page ? page * limit : 0;  // Calculul offsetului pentru paginare
    const sortOrder = sort && order ? [[sort, order]] : [['createdAt', 'DESC']];  // Ordonare implicită

    // Construiește condiții de filtrare din parametrii rămași
    const where = {};
    Object.keys(filterParams).forEach(key => {
        where[key] = filterParams[key];
    });

    try {
        const { count, rows } = await Event.findAndCountAll({
            where: where,
            include: [{
                model: Location,
                required: false  // Schimbă în true dacă vrei să returnezi doar evenimentele care au o locație
            }],
            limit: limit,
            offset: offset,
            order: sortOrder
        });

        if (count === 0) {
            return res.status(200).json({
                success: true,
                message: "No events found",
                data: [],
                total: 0,
                currentPage: page ? +page : 0,
                totalPages: 0
            });
        }

        res.status(200).json({
            success: true,
            message: "Events found",
            data: rows,
            total: count,
            currentPage: page ? +page : 0,
            totalPages: Math.ceil(count / limit)
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding events",
            data: err
        });
    }
};


const getEvent = async (req, res) => {
    const { id } = req.query;

    try{
        const event = await Event.findOne({
            where: {
                event_id: id
            },
            include: [{
                model: Location,
                required: false  // Schimbă în true dacă vrei să returnezi doar evenimentele care au o locație
            }],
        });

        res.status(200).json({
            success: true,
            message: "Event found",
            data: event
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding event",
            data: err
        });
    }
};

const uploadPhoto = async (req, res) => {
    const { id } = req.query;
    const file = req.file;

    try{
        const resizedImageBuffer = await sharp(file.buffer)
            .resize(800, 800, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .jpeg({ quality: 50 })
            .toBuffer()

        console.log("Processed image size: ", resizedImageBuffer.length);
        const event = await Event.update({ image: resizedImageBuffer }, {
            where: {
                event_id: id
            }
        });
        console.log('event', event);

        res.status(200).json({
            success: true,
            message: "Photo uploaded"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error uploading photo",
            data: err
        });
    }
}

const findCategories = async (req, res) => {
    try {
        console.log('findCategories');
        // const categories = await Event.findAll({
        //     attributes: ['category'],
        //     group: ['category']
        // });

        const categories = await Event.findAll({
            attributes: [
                [Event.sequelize.fn('DISTINCT', Event.sequelize.col('category')), 'category']
            ],
            order: [['category', 'ASC']], // Oprețional: Sortează categoriile în ordine alfabetică
        });

        const categoriesArray = categories.map(cat => cat.category);
        console.log('categories', categories);

        res.status(200).json({
            success: true,
            message: "Categories found",
            data: categoriesArray
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding categories",
            data: err
        });
    }
}

const findLocations = async (req, res) => {
    const id = req.user.id; 
    try {
        const locations = await Event.findAll({
            attributes: [
                'location_id'  // Asigură-te că 'location_id' este inclus în gruparea pentru a evita duplicatele
            ],
            include: [{
                model: Location,
                attributes: ['name'],  // Adaugă 'name' ca atribut necesar din modelul Location
                required: true,
                where: {
                    admin_id: id
                }
            }],
            group: ['Event.location_id', 'Location.location_id'], // Include Location.id în grup pentru a asigura corectitudinea rezultatelor
            
        });

        // Mapează rezultatele pentru a crea un array de obiecte cu id și nume
        const locationsArray = locations.map(event => ({
            id: event.location_id,
            name: event.Location ? event.Location.name : 'No name available'
        }));

        console.log('locations', locationsArray);

        res.status(200).json({
            success: true,
            message: "Locations found",
            data: locationsArray
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Error finding locations",
            data: err
        });
    }
}

const findEventsByAdmin = async (req, res) => {
    const id = req.user.id;
    try {
        const events = await Event.findAll({
            include: [{
                model: Location,
                required: true,
                where: {
                    admin_id: id
                }
            }]
        });

        res.status(200).json({
            success: true,
            message: "Events found",
            data: events
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding events",
            data: err
        });
    }
}


module.exports = {
    saveEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    getEvent,
    uploadPhoto,
    findCategories,
    findLocations,
    findEventsByAdmin
};
