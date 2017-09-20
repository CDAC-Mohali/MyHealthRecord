var nodemailer = require('nodemailer');

var method = MailerService.prototype;

function MailerService() {
    this.transporter = nodemailer.createTransport({
        host: 'Your Host Name',
        port: 587,
        //secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'Your Username',
            pass: 'Your Password'
        }
    });
    this.transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });
}

method.setMailOptions = function(to, subject, html) {
    this.mailOptions = {
        from: "My Health Record <>",
        to: to,
        subject: subject,
        html: html,

    };
};
method.setMailOptionswithattachment = function(to, subject, html, filename, data) {
    this.mailOptions = {
        from: "My Health Record <>",
        to: to,
        subject: subject,
        html: html,
        attachments: [{ 'filename': filename, 'content': new Buffer(data, 'base64') }]
    };
};
method.dispatch = function() {
    this.transporter.sendMail(this.mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
};

module.exports = MailerService;