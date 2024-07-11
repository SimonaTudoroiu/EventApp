const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const { Op } = require("sequelize");

const Administrator = require('../models/administrator');
const AdministratorDocument = require('../models/administratorDocument');
const TokenAdministrator = require('../models/tokenAdministrator');

const saveAdministrator = async (req, res) => {
    const administratorBody = req.body;
    req.body.password = await bcrypt.hash(req.body.password, 10);

    try {
        const administrator = await Administrator.create(administratorBody);

        res.status(200).json({
            success: true,
            message: "Administrator created successfully",
            data: administrator
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error creating administrator",
            data: err
        });
    }
};

const updateAdministrator = async (req, res) => {
    const newBody = req.body;

    if(newBody.password) {
        newBody.password = await bcrypt.hash(newBody.password, 10);
    }

    try{
        
        const administrator = await Administrator.update(newBody, {
            where: {
                admin_id: req.user.id
            }
        });

        res.status(200).json({
            success: true,
            message: "Administrator updated"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error updating administrator",
            data: err
        });
    }
};

const deleteAdministrator = async (req, res) => {
    const administratorId = req.user.id;

    try{
        const administrator = await Administrator.destroy({
            where: {
                admin_id: administratorId
            }
        });

        res.status(200).json({
            success: true,
            message: "Administrator deleted"
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Error deleting administrator",
            data: err
        });
    }
};



const loginAdministrator = async (req, res) => {
    const { email, password } = req.body;

    try {
        const administrator = await Administrator.findOne({
            where: {
                email
            }
        });

        const match = await bcrypt.compare(password, administrator.password);

        if (!administrator || !match) {
            throw new Error('Invalid login credentials!');
        }

        const accessToken = jwt.sign({ id: administrator.admin_id, role: "administrator" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        if(administrator.first_name === "pending") {

            res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken,
                status: "pending"
            });
            return;
        }


        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            status: "approved"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Error logging in",
            data: err.message
        });
    }
}

function trimiteEmail() {  
    $.ajax({
        url:'api/admin/trimite-cod',
        type:'POST',
        success:function(data){
            console.log("S-a trimis email-ul care contine codul de confirmare");
        },
        error:function(xhr, status, error){
            console.log('Eroare la trimiterea email-ului', error);
        }
    });
}

const uploadImages = async (req, res) => {
    try {
        const files = req.files;
        const images = files.map(file => ({ 
            filename: file.originalname,
            content: file.buffer
        }));

    
        const administrator = await Administrator.create({
            first_name: "pending",
            last_name: "pending",
            email: req.query.email,
            password: "pending"
        });

        for (let image of images) {
            const document = await AdministratorDocument.create({
                document_name: image.filename,
                image: image.content,
                admin_id: administrator.admin_id
            });

        }
        res.status(200).json({
            success: true,
            message: "Pending Administrator created successfully",
            data: administrator
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Error uploading images",
            data: err
        });
    }
}

// const trimiteCod = async (req, res) => {
//     const { email, cod } = req.body;
//     // const cod = Math.floor(10000 + Math.random() * 90000);

//     const transporter = nodemailer.createTransport({
//         // Adaugati aici configuratiile pentru trimiterea email-ului
//         // de exemplu, pentru Gmail:
//         service: 'gmail',
//         auth: {
//             user: 'youreventappnow@gmail.com',
//             pass: 'umbj bdyd ibzm hjjm'
//         }
//     });

//     // Definim continutul email-ului
//     const mailOptions = {
//         from: 'youreventappnow@gmail.com',
//         to: email,
//         subject: 'Codul tau de confirmare a sosit!',
//         html: 'Salut! Codul tau de confirmare este: <br> ' + cod
//         };

//     // Trimitem email-ul
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error(error);
//             res.status(500).json({
//                 success: false,
//                 message: "Error sending email",
//                 data: error
//             });
//         } else {
//             console.log('Email sent: ' + info.response);
//             res.status(200).json({
//                 success: true,
//                 message: "Email sent successfully",
//                 data: info.response
//             });
//         }
//     });


    
// }

const requestPasswordReset = async (req, res ) => {
    try
    {
        const admin = await Administrator.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!admin) {
            throw new Error('Invalid email!');

        }

        await TokenAdministrator.destroy({
            where: {
                admin_id: admin.admin_id,
            }
        });
    
        const cod = Math.floor(10000 + Math.random() * 90000).toString();
    
        const expireDate = new Date(new Date().getTime() + (60 * 60 * 1000))
    
        await TokenAdministrator.create({
            admin_id: admin.admin_id,
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
        const admin = await Administrator.findOne({
            where: {
                email: req.body.email
            }
        });

        console.log("admin", admin);

        await TokenAdministrator.destroy({
            where: {
            expiration: { [Op.lt]: Administrator.sequelize.fn('CURDATE')},
            }
        });

 
        const record = await TokenAdministrator.findOne({
            where: {
                admin_id: admin.admin_id,
                expiration: { [Op.gt]: Administrator.sequelize.fn('CURDATE')},
                token: req.body.token,
            }
        });

        console.log("record", record);
 
        if (record == null) {
            throw new Error('Invalid token. Please try again!');
        }

        const newPassword = await bcrypt.hash(req.body.password, 10);

        await Administrator.update({
            password: newPassword
        },
        {
            where: {
                admin_id: admin.admin_id
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
module.exports = { saveAdministrator, updateAdministrator, deleteAdministrator, loginAdministrator, uploadImages, requestPasswordReset, resetPassword};
