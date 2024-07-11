const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');
const { randomUUID } = require('crypto');

const Administrator = require('./administrator');

const Location = sequelize.define('Location', {
    location_id : {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    latitude: {
        type: DataTypes.FLOAT,
        validate: {
          min: -90,
          max: 90
        }
    },
    longitude: {
        type: DataTypes.FLOAT,
        validate: {
            min: -180,
            max: 180
        }
    },
    description: {
        type: DataTypes.STRING,
        default: null
    },
    review_summary: {
        type: DataTypes.FLOAT,
        default: 0
    },
},{
    validate: {
        bothCoordsOrNone() {
            if ((this.latitude === null) !== (this.longitude === null)) {
                throw new Error('Require either both latitude and longitude or neither');
            }
        }
    }
});

Location.belongsTo(Administrator, {foreignKey: 'admin_id', constraints: false});
Administrator.hasMany(Location, {foreignKey: 'admin_id', constraints: false, onDelete: 'CASCADE'});

sequelize.sync().then(() => {
    console.log('Location table created');
}).catch(err => {
    console.log('Error creating Location table', err);
});

module.exports = Location;