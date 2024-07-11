const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const Administrator = require('./administrator');

const AdministratorDocument = sequelize.define('AdministratorDocument', {
    document_id : {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => randomUUID()
    },
    admin_id : {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Administrators',
            key: 'admin_id'
        }
    },
    document_name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    image : {
        type: DataTypes.BLOB,
        allowNull: false
    }
});

AdministratorDocument.belongsTo(Administrator, {foreignKey: 'admin_id', constraints: false});
Administrator.hasMany(AdministratorDocument, {foreignKey: 'admin_id', constraints: false, onDelete: 'CASCADE'});

sequelize.sync().then(() => {
    console.log('AdministratorDocument table created');
}).catch(err => {
    console.log('Error creating AdministratorDocument table', err);
});

module.exports = AdministratorDocument;