const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const User = sequelize.define('User', {
    user_id : {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => randomUUID()
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlpha: true,
            notEmpty: true
        }
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlpha: true,
            notEmpty: true
        }
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'email',
        validate: {
            isEmail: true
        }
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

sequelize.sync().then(() => {
    console.log('User table created');
}).catch(err => {
    console.log('Error creating User table', err);
});

module.exports = User;