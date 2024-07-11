const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const User = require('./user');

const Token = sequelize.define('Token', {
    token_id : {
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
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiration : {
        type: DataTypes.DATE,
        allowNull: false,
    }
});


User.hasOne(Token, {foreignKey: 'user_id', constraints: false, onDelete: 'CASCADE'});
Token.belongsTo(User, {foreignKey: 'user_id', constraints: false});

sequelize.sync().then(() => {
    console.log('Token table created');
}).catch(err => {
    console.log('Error creating Token table', err);
});

module.exports = Token;