const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const Location = require('./location');
const Event = require('./event');
const { on } = require('events');

const LocationCalendar = sequelize.define('LocationCalendar', {
    calendar_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => randomUUID()
    },
    location_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Locations',
            key: 'location_id'
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
    date_added: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

Location.hasMany(LocationCalendar, {foreignKey: 'location_id', constraints: false, onDelete: 'CASCADE'});
LocationCalendar.belongsTo(Location, {foreignKey: 'location_id', constraints: false});

LocationCalendar.belongsTo(Event, {foreignKey: 'event_id', constraints: false});
Event.hasMany(LocationCalendar, {foreignKey: 'event_id', constraints: false, onDelete: 'CASCADE'});

sequelize.sync().then(() => {
    console.log('LocationCalendar table created');
}).catch(err => {
    console.log('Error creating LocationCalendar table', err);
});

module.exports = LocationCalendar;