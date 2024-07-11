const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
    const { email, message } = req.body;
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youreventappnow@gmail.com',
            pass: 'umbj bdyd ibzm hjjm'
        }
    });

    const mailOptions = {
      from: 'youreventappnow@gmail.com', // Adresa ta de email (emailul aplicației)
      to: 'youreventappnow@gmail.com', // Destinatarul mesajului (e.g., support sau contact email al aplicației)
      subject: 'New Contact Us Message',
      text: `Message: ${message}`,
      replyTo: email // Adresa de email a utilizatorului pentru răspuns
    };
  
    transport.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully');
      }
    });
};

module.exports = {sendEmail};