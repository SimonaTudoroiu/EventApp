const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const User = require('./user');
const Event = require('./event');

const Reservation = sequelize.define('Reservation', {
    reservation_id: {
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
    num_of_seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            isInt: true,
            notEmpty: true
        }
    },
    reservation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: true,
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING
    }
});


User.hasMany(Reservation, {foreignKey: 'user_id', constraints: false, onDelete: 'CASCADE'});
Reservation.belongsTo(User, {foreignKey: 'user_id', constraints: false});

Reservation.belongsTo(Event, {foreignKey: 'event_id', constraints: false});
Event.hasMany(Reservation, {foreignKey: 'event_id', constraints: false, onDelete: 'CASCADE'});

sequelize.sync().then(() => {
    console.log('Reservation table created');
}).catch(err => {
    console.log('Error creating Reservation table', err);
});

module.exports = Reservation;