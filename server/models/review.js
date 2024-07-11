const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const User = require('./user');
const Event = require('./event');

const Review = sequelize.define('Review', {
    review_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => randomUUID()
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id'
        }
    },
    event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Events',
            key: 'event_id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.STRING
    },
    review_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: true
        }
    }
});


User.hasMany(Review, {foreignKey: 'user_id', constraints: false, onDelete: 'CASCADE'});
Review.belongsTo(User, {foreignKey: 'user_id', constraints: false});

Review.belongsTo(Event, {foreignKey: 'event_id', constraints: false});
Event.hasMany(Review, {foreignKey: 'event_id', constraints: false, onDelete: 'CASCADE'});

sequelize.sync().then(() => {
    console.log('Review table created');
}).catch(err => {
    console.log('Error creating Review table', err);
});

module.exports = Review;