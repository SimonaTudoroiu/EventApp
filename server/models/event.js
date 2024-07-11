const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const Location = require('./location');

const Event = sequelize.define('Event', {
    event_id: {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            notEmpty: true
        }
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        query: {
            isDate: true,
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    available_spots: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            notEmpty: true
        }
    },
    reserved_spots: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    review_summary: {
        type: DataTypes.FLOAT,
        default: 0
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            notEmpty: true
        },
        default: 0
    },
    image : {
        type: DataTypes.BLOB,
        allowNull: false
    }
});

Event.belongsTo(Location, {foreignKey: 'location_id', constraints: false});
Location.hasMany(Event, {foreignKey: 'location_id', constraints: false, onDelete: 'CASCADE'});

sequelize.sync().then(() => {
    console.log('Event table created');
}).catch(err => {
    console.log('Error creating Event table', err);
});

module.exports = Event;