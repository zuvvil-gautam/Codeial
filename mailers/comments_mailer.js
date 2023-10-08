const nodemailer = require('../config/nodemailer');

// This is another way of exporting a method
exports.newComment = (comment) => {
    console.log('Inside newComment mailer', comment);

    // Check if comment is defined
    if (!comment) {
        console.log('Comment is undefined or missing.');
        return;
    }

    // Check if comment.user is defined
    if (!comment.user) {
        console.log('User is undefined or missing within the comment.');
        return;
    }
    // Check if comment.user.email is defined

    if (!comment.user.email) {
        console.log('User email is undefined or missing within the comment.');
        return;
    }

    // If all checks pass, send the email
    nodemailer.transporter.sendMail(
        {
            from: 'zuvvilgautamr123@gmail.com',
            to: comment.user.email,
            subject: "New Comment Published!",
            html: '<h1>Yup, your comment is now published!</h1>'
        },
        (err, info) => {
            if (err) {
                console.log('Error in sending mail', err);
                return;
            }
            console.log('Message sent', info);
        }
    );
}
