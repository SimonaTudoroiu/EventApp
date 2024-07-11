const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const nodemailer = require('nodemailer');

const User = require('../models/user');
const UserCalendar = require('../models/userCalendar');
const Token = require('../models/token');

const saveUser = async (req, res) => {
    const userBody = req.body;
    req.body.password = await bcrypt.hash(req.body.password, 10);

    try {
        const user = await User.create(userBody);

        await UserCalendar.create({
            user_id: user.user_id,
            number_of_events: 0
        });
        
        res.status(200).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error creating user",
            data: err
        });
    }
};

const updateUser = async (req, res) => {
    const newBody = req.body;

    if(newBody.password) {
        newBody.password = await bcrypt.hash(newBody.password, 10);
    }

    try{
        const user = await User.update(newBody, {
            where: {
                user_id: req.user.id
            }
        });

        res.status(200).json({
            success: true,
            message: "User updated"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error updating user",
            data: err
        });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.user.id;

    try{
        const user = await User.destroy({
            where: {
                user_id: userId
            }
        });

        res.status(200).json({
            success: true,
            message: "User deleted"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error deleting user",
            data: err
        });
    }
};

// const getUserByPreference = async (req, res) => {
//     const preference = req.body.preference;

//     try{
//         const users = await User.findAll({
//             where: {
//                 preferences: {
//                     [Op.like]: `%${preference}%`
//                 }
//             }
//         });

//         res.status(200).json({
//             success: true,
//             message: "Users found",
//             data: users
//         });
//     }
//     catch (err) {
//         res.status(400).json({
//             success: false,
//             message: "Error finding users",
//             data: err
//         });
//     }
// };

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email === process.env.GENERAL_ADMIN_EMAIL && password === process.env.GENERAL_ADMIN_PASSWORD) {
            const accessToken = jwt.sign({ email: process.env.GENERAL_ADMIN_EMAIL, role: "general_admin" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

            return res.status(200).json({
                success: true,
                message: "General admin login successful",
                accessToken,
                role: "general_admin"
            });
        }

        const user = await User.findOne({
            where: {
                email
            }
        });

        const match = await bcrypt.compare(password, user.password);

        if (!user || !match) {
            throw new Error('Invalid login credentials!');
        }

        const accessToken = jwt.sign({ id: user.user_id, role: "user" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            role: "user"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Error logging in",
            data: err.message
        });
    }
}

const requestPasswordReset = async (req, res ) => {
    try
    {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            throw new Error('Invalid email!');

        }
    
        const cod = Math.floor(10000 + Math.random() * 90000).toString();
    
        const expireDate = new Date(new Date().getTime() + (60 * 60 * 1000))
    
        await Token.create({
            user_id: user.user_id,
            expiration: expireDate,
            token: cod,
            used: 0
        });

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'youreventappnow@gmail.com',
                pass: 'umbj bdyd ibzm hjjm'
            }
        });
    
        const message = {
            from: 'youreventappnow@gmail.com',
            to: req.body.email,
            subject: "Recover yout password",
            text: 'To reset your password, please copy the following code and paste it in the app: ' + cod
        };

        transport.sendMail(message, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "Error sending email",
                    data: error
                });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({
                    success: true,
                    message: "Email sent successfully",
                    data: info.response
                });
            }
        });
    
        res.status(200).json({
            success: true,
            message: "Email send successfully",
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error logging in",
            data: err.message
        });
    }
}

const resetPassword = async (req, res) => {
    try{
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        await Token.destroy({
            where: {
            expiration: { [Op.lt]: User.sequelize.fn('CURDATE')},
            }
        });
 
        const record = await Token.findOne({
            where: {
                user_id: user.user_id,
                expiration: { [Op.gt]: User.sequelize.fn('CURDATE')},
                token: req.body.token,
            }
        });
 
        if (record == null) {
            throw new Error('Invalid token. Please try again!');
        }

        const newPassword = await bcrypt.hash(req.body.password, 10);

        await User.update({
            password: newPassword
        },
        {
            where: {
                user_id: user.user_id
            }
        });


        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
 
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error logging in",
            data: err.message
        });
    }
}
module.exports = { saveUser, updateUser, deleteUser, loginUser, requestPasswordReset, resetPassword};
