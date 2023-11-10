require('dotenv').config();

const express       = require('express');
const app           = express();
const path          = require('path');
const cors          = require('cors');
//const corsOptions   = require('./config/corsOptions');
const cookieParser  = require('cookie-parser');
//const credentials   = require('./middleware/credentials');
const mongoose      = require('mongoose');
const connectDB     = require('./config/dbCon');
const verifyJWT     = require('./middleware/verifyJWT');

/* Connect to mongose DB */
connectDB();

/* Middleware to allow CORS for login */
//app.use(credentials);

/* Set-up CORS */
//app.use(cors(corsOptions));
app.use(cors());

/* Middleware to handle JSON data*/
app.use(express.json());

/* Middleware for cookies */
app.use(cookieParser());

app.set('views', './views');

/* Middleware to serve static files */
app.use(express.static('./static'));


/* Setup Routes */
app.use('/', require('./routes/root'));

app.use('/api/register', require('./routes/api/auth/register'));
app.use('/api/login', require('./routes/api/auth/login'));
app.use('/api/refresh', require('./routes/api/auth/refresh'));
app.use('/api/logout', require('./routes/api/auth/logout'));

app.use('/api/faculty/register', require('./routes/api/faculty/register'));
app.use('/api/faculty/login', require('./routes/api/faculty/login'));

/* Setup Protected Routes */
app.use(verifyJWT);
app.use('/api/challenges', require('./routes/api/challenges/challenges'));
app.use('/api/challenges/upload', require('./routes/api/challenges/upload'));
app.use('/api/challenges/download', require('./routes/api/challenges/download'));
app.use('/api/challenges/validate', require('./routes/api/challenges/validate'));
app.use('/api/challenges/hint', require('./routes/api/challenges/hint'));

app.use('/api/subjects', require('./routes/api/subjects/subjects'));
app.use('/api/subjects/enroll-subjects', require('./routes/api/subjects/enrollSubjects'));

app.use('/api/stats/leaderboard', require('./routes/api/stats/leaderboard'));
app.use('/api/stats/user-dashboard', require('./routes/api/stats/userDashboard'));

app.use('/api/faculty/verify', require('./routes/api/faculty/verification'));

app.all('*', (req, res) => {
    return res.status(404).send('404 page not found');
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(1337, () => console.log('Listening on port 1337'))
});
