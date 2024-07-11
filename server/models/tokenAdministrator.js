const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const Administrator = require('./administrator');

const TokenAdministrator = sequelize.define('TokenAdministrator', {
    token_id : {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => randomUUID()
    },
    admin_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Administrators',
            key: 'admin_id'
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


Administrator.hasOne(TokenAdministrator, {foreignKey: 'admin_id', constraints: false, onDelete: 'CASCADE'});
TokenAdministrator.belongsTo(Administrator, {foreignKey: 'admin_id', constraints: false});

sequelize.sync().then(() => {
    console.log('TokenAdministrator table created');
}).catch(err => {
    console.log('Error creating TokenAdministrator table', err);
});

module.exports = TokenAdministrator;