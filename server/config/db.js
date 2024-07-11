const Sequelize = require('sequelize');
const dotenv = require('dotenv');  


dotenv.config();


//MYSQL CONNECTION

console.log(process.env.DB_NAME);


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);


//TEST DATABASE CONNECTION
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

 
module.exports = sequelize;