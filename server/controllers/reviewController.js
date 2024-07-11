const { Op } = require("sequelize");

const Review = require('../models/review');
const Event = require('../models/event');
const Location = require('../models/location');
const User = require('../models/user');

const saveReview = async (req, res) => {
    const corpRecenzie = req.body;
    try {
        const recenzie = await Review.create({
            user_id: req.user.id,
            ...corpRecenzie});
        const { avg } = await Review.findOne({
            where: {
                event_id: recenzie.event_id
            },
            attributes: [[Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avg']],
            raw: true
        });

        await Event.update({review_summary: avg}, {
            where: {
                event_id: recenzie.event_id
            }
        });

        const eveniment = await Event.findOne({
            where: {
                event_id: recenzie.event_id
            }
        });

        const { avg_event } = await Event.findOne({
            where: {
                location_id: eveniment.location_id
            },
            attributes: [[Event.sequelize.fn('AVG', Event.sequelize.col('review_summary')), 'avg_event']],
            raw: true
        });

        await Location.update({review_summary: avg_event}, {
            where: {
                location_id: eveniment.location_id
            }
        });

        res.status(200).json({
            success: true,
            message: "Review created successfully",
            data: recenzie
        });
    }
    catch (err) {
        console.log('err', err);
        res.status(400).json({
            success: false,
            message: "Error creating review",
            data: err
        });
    }
}

const updateReview = async (req, res) => {
    const newBody = req.body;

    try{
        const review = await Review.findOne({
            where: {
                review_id: newBody.review_id
            }
        });

        await Review.update(newBody, {
            where: {
                review_id: newBody.review_id
            }
        });

        const { avg } = await Review.findOne({
            where: {
                event_id: review.event_id
            },
            attributes: [[Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avg']],
            raw: true
        });


        await Event.update({review_summary: avg}, {
            where: {
                event_id: review.event_id
            }
        });

        res.status(200).json({
            success: true,
            message: "Review updated"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error updating review",
            data: err
        });
    }
};  

const deleteReview = async (req, res) => {
    const { id } = req.query;

    try{
        const review = await Review.findOne({
            where: {
                review_id: id
            }
        });

        await Review.destroy({
            where: {
                review_id: id
            }
        });

        const { avg } = await Review.findOne({
            where: {
                event_id: review.event_id
            },
            attributes: [[Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avg']],
            raw: true
        });


        await Event.update({review_summary: avg}, {
            where: {
                event_id: review.event_id
            }
        });

        res.status(200).json({
            success: true,
            message: "Review deleted"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error deleting review",
            data: err
        });
    }
};

const getReviews = async (req, res) => {
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
        const {count, rows} = await Review.findAndCountAll({
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
                message: "No reviews found",
                data: [],
                total: 0,
                currentPage: page ? +page : 0,
                totalPages: 0
            });
        }

        res.status(200).json({
            success: true,
            message: "Reviews found",
            data: rows,
            total: count,
            currentPage: page ? +page : 0,
            totalPages: Math.ceil(count / limit)
        });

    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error finding reviews",
            data: err
        });
    }
}

const getReviewById = async (req, res) => {
    const { id } = req.query;

    try{
        const review = await Review.findOne({
            where: {
                review_id: id
            }
        });

        res.status(200).json({
            success: true,
            message: "Review retrieved",
            data: review
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error retrieving review",
            data: err
        });
    }
}

module.exports = {
    saveReview,
    updateReview,
    deleteReview,
    getReviews,
    getReviewById
};