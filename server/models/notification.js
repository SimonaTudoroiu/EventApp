const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const Event = require('./event');
const { on } = require('events');

const Notification = sequelize.define('Notification', {
    notification_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => randomUUID()
    },
    event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Events',
            key: 'event_id'
        }
    },
    notification_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: true,
            notEmpty: true
        }
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

Event.hasMany(Notification, {foreignKey: 'event_id', constraints: false, onDelete: 'CASCADE'});
Notification.belongsTo(Event, {foreignKey: 'event_id', constraints: false});

sequelize.sync().then(() => {
    console.log('Notification table created');
}).catch(err => {
    console.log('Error creating Notification table', err);
});

module.exports = Notification;