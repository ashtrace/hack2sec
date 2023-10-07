require('dotenv').config();

const express       = require('express');
const app           = express();
const path          = require('path');
const cors          = require('cors');
const corsOptions   = require('./config/corsOptions');
const cookieParser  = require('cookie-parser');
const credentials   = require('./middleware/credentials');
const mongoose      = require('mongoose');
const connectDB     = require('./config/dbCon');
const verifyJWT = require('./middleware/verifyJWT');

/* Connect to mongose DB */
connectDB();

/* Middleware to allow CORS for login */
app.use(credentials);

/* Set-up CORS */
app.use(cors(corsOptions));

/* Middleware to handle JSON data*/
app.use(express.json());

/* Middleware for cookies */
app.use(cookieParser());

app.set('views', './views');

/* Middleware to serve static files */
app.use(express.static('./static'));


/* Setup Routes */
app.use('/', require('./routes/root'));
app.use('/api/register', require('./routes/api/register'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/refresh', require('./routes/api/refresh'));
app.use('/api/logout', require('./routes/api/logout'));

/* Setup Protected Routes */
app.use(verifyJWT);
app.use('/api/challenges', require('./routes/api/challenges'));

app.all('*', (req, res) => {
    return res.status(404).send('404 page not found');
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(1337, () => console.log('Listening on port 1337'))
});
