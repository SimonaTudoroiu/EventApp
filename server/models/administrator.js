const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const Administrator = sequelize.define('Administrator', {
    admin_id : {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => randomUUID()
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
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
        allowNull: false
    }
});


sequelize.sync().then(() => {
    console.log('Administrator table created');
}).catch(err => {
    console.log('Error creating Administrator table', err);
});

module.exports = Administrator;