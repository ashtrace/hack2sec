const { createTransporter } = require('../../config/emailCon');

async function sendmail(recepient, subject, body) {
    const transporter = await createTransporter();

    const mailOptions = {
        from: process.env.ADMIN_EMAIL_ADDRESS,
        to: recepient,
        subject: subject,
        text: body.text,
        html: body.html
    };

    await transporter.sendMail(mailOptions)
        .then(result => {
            console.log(result);
            return true;
        })
        .catch(err => {
            console.error(err);
            return false;
        })
}

module.exports = { sendmail }