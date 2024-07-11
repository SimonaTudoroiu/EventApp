const { Op } = require("sequelize");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const AdministratorDocument = require('../models/administratorDocument');
const Administrator = require('../models/administrator');

const getDocuments = async (req, res) => {
    try {
        // Folosim Sequelize pentru a găsi toți administratorii cu parola 'pending'
        const administrators = await Administrator.findAll({
            where: {
                password: 'pending'
            }
        });

        // Construim un array pentru a stoca toate datele relevante
        const administratorsWithDocuments = [];

        // Parcurgem fiecare administrator găsit
        for (const administrator of administrators) {
            // Folosim metoda Sequelize 'getAdministratorDocuments' pentru a obține documentele asociate cu acest administrator
            const documents = await administrator.getAdministratorDocuments();
            // Adăugăm administratorul și documentele sale în array
            administratorsWithDocuments.push({
                administrator,
                documents
            });
        }

        // const documents = await AdministratorDocument.findAll(); // Recuperarea tuturor documentelor
        // const pendingAdmins = await Administrator.findAll({
        //     where: {
        //         password: {
        //             [Op.eq]: 'pending'
        //         }
        //     }
        // });
        // let htmlResponse = '<h1>Imagini Administrator</h1>'; // Markup-ul HTML
        // documents.forEach(document => {
        //     // Adăugarea fiecărei imagini în markup-ul HTML
        //     htmlResponse += `<img src="data:image/jpeg;base64,${document.image.toString('base64')}">`;
        // });
        // res.send(htmlResponse); // Trimiterea markup-ului HTML către client
        res.status(200).json({
            success: true,
            message: "Success ",
            data: administratorsWithDocuments
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Error ",
            data: err.message
        });
    }
};
function sendEmail (email, status, cod) {
    

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youreventappnow@gmail.com',
            pass: 'umbj bdyd ibzm hjjm'
        }
    });

    let data;
    if(status === 'accept'){
        data = {
            from: 'youreventappnow@gmail.com',
            to: email,
            subject: 'Your administrator account on EventApp has been accepted!',
            html: 'Hello! Your account has been accepted! Here is the code that you have to insert as password: ' + cod
        };
    }
    else{
        data = {
            from: 'youreventappnow@gmail.com',
            to: email,
            subject: 'Your administrator account on EventApp has been denied!',
            html: 'Hello! Your account has been denied! You can try again with other documents!' 
        };
    }
    

    transport.sendMail(data, (error, info) => {
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


}
const acceptAdministrator = async (req, res) => {
    try{

        const { email } = req.body;
        const cod = Math.floor(10000 + Math.random() * 90000).toString();

        const pass = await bcrypt.hash(cod, 10);
        
        const administratorBody = {
            password: pass
        }
        const administrator = await Administrator.update(administratorBody, {
            where: {
                email
            }
        });
        sendEmail(email, 'accept', cod);
        res.status(200).json({
            success: true,
            message: "Success "
        });
    }
    catch (err){
        res.status(400).json({
            success: false,
            message: "Error ",
            data: err.message
        });
    }
};

const denyAdministrator = async (req, res) => {
    try{

        const { email } = req.query;
        
        const administrator = await Administrator.destroy({
            where: {
                email
            }
        });
        sendEmail(email, 'deny', 0);
        res.status(200).json({
            success: true,
            message: "Success "
        });
    }
    catch (err){
        res.status(400).json({
            success: false,
            message: "Error ",
            data: err.message
        });
    }
};
module.exports = { getDocuments, acceptAdministrator, denyAdministrator};
