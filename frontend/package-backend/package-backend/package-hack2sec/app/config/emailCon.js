const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const createTransporter = async () => {
    const CLIENT_ID     = process.env.GOOGLE_OAUTH2_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
    const REDIRECT_URI  = process.env.GOOGLE_OAUTH2_REDIRECT_URI;
    const REFRESH_TOKEN = process.env.GMAIL_API_REFRESH_TOKEN;

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const accessToken = await oAuth2Client.getAccessToken();
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.ADMIN_EMAIL_ADDRESS,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        }
    });

    return transporter;
}

module.exports = { createTransporter };