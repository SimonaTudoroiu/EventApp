const express = require('express');
const dotenv = require('dotenv');   
const fs = require('fs');
const sequelize = require('./config/db');
const user = require('./models/user');
const administrator = require('./models/administrator');
const location = require('./models/location');
const event = require('./models/event');
const locationCalendar = require('./models/locationCalendar');
const userCalendar = require('./models/userCalendar');
const reservation = require('./models/reservation');
const review = require('./models/review');
const notification = require('./models/notification');
const administratorDocument = require('./models/administratorDocument');
const token = require('./models/token');    
const TokenAdministrator = require('./models/tokenAdministrator');

const verifyToken = require('./middlewares/verifyToken');
const verifyRole = require('./middlewares/verifyRole');
//DOTENV
dotenv.config();

//REST OBJECT
const app = express();

//MIDDLEWARES
app.use(express.json());


//ROUTES
app.get('', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the API"
    });
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/administratorRoutes'));
app.use('/api/general-admin', [verifyToken, verifyRole(['general_admin'])], require('./routes/generalAdministratorRoutes'));
app.use('/api/location' ,require('./routes/locationRoutes'));
// app.use('/api/location',require('./routes/locationRoutes'));

app.use('/api/event',require('./routes/eventRoutes'));
app.use('/api/location-calendar',[verifyToken, verifyRole(['administrator'])],require('./routes/locationCalendarRoutes'));
app.use('/api/user-calendar',[verifyToken, verifyRole(['user'])], require('./routes/userCalendarRoutes'));
app.use('/api/reservation',require('./routes/reservationRoutes'));
app.use('/api/review',require('./routes/reviewRoutes'));
app.use('/api/notification',require('./routes/notificationRoutes'));
app.use('/api/contact', require('./routes/contactAppRoutes'));
//PORT
const PORT = process.env.PORT || 8080;

//LISTEN
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});