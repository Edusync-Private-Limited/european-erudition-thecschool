const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the email service
    auth: {
        user: 'personal2604okra@gmail.com', // Your Gmail address
        pass: 'smbm vlue muud csfn', // Your Gmail password or app-specific password
    },
});

// Function to send an email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'your-email@gmail.com', // Sender address
        to: to, // Recipient address
        subject: subject, // Subject line
        text: text, // Plain text body
        // html: '<h1>Hello</h1><p>This is an HTML email.</p>', // Optional HTML body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendEmail;