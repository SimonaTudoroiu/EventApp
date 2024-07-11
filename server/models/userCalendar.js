const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const User = require('./user');
const Event = require('./event');

const UserCalendar = sequelize.define('UserCalendar', {
    calendar_id: {
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
    number_of_events: {
        type: DataTypes.INTEGER,
        default: 0
    }
});

User.hasOne(UserCalendar, {foreignKey: 'user_id', constraints: false, onDelete: 'CASCADE'});
UserCalendar.belongsTo(User, {foreignKey: 'user_id', constraints: false});

UserCalendar.belongsToMany(Event, {through: 'EventUserCalendar', foreignKey: 'calendar_id'});
Event.belongsToMany(UserCalendar, {through: 'EventUserCalendar',  foreignKey: 'event_id'});

sequelize.sync().then(() => {
    console.log('UserCalendar table created');
}).catch(err => {
    console.log('Error creating UserCalendar table', err);
});

module.exports = UserCalendar;