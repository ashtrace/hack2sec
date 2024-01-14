require('dotenv').config();

const express       = require('express');
const app           = express();
const path          = require('path');
const cors          = require('cors');
const cookieParser  = require('cookie-parser');
const mongoose      = require('mongoose');
const connectDB     = require('./config/dbCon');
const verifyJWT     = require('./middleware/verifyJWT');

/* Connect to mongose DB */
connectDB();

/* Set-up CORS */
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

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
app.use('/api/forgot-password', require('./routes/api/auth/forgotPassword'));

app.use('/api/faculty/register', require('./routes/api/faculty/register'));
app.use('/api/faculty/login', require('./routes/api/faculty/login'));

app.use('/api/subjects', require('./routes/api/subjects/subjects'));

/* Setup Protected Routes */
app.use(verifyJWT);

app.use('/api/user', require('./routes/api/user/user'));

app.use('/api/challenges', require('./routes/api/challenges/challenges'));
app.use('/api/challenges/upload', require('./routes/api/challenges/upload'));
app.use('/api/challenges/download', require('./routes/api/challenges/download'));
app.use('/api/challenges/validate', require('./routes/api/challenges/validate'));
app.use('/api/challenges/hint', require('./routes/api/challenges/hint'));
app.use('/api/mychallenges', require('./routes/api/challenges/mychallenges'));

app.use('/api/subjects/enroll-subjects', require('./routes/api/subjects/enrollSubjects'));

app.use('/api/stats/leaderboard', require('./routes/api/stats/leaderboard'));
app.use('/api/stats/user-dashboard', require('./routes/api/stats/userDashboard'));

app.use('/api/faculty/verify', require('./routes/api/faculty/verification'));
app.use('/api/faculty', require('./routes/api/faculty/faculty'));

app.use('/api/stats/count/users', require('./routes/api/stats/count/registration'));
app.use('/api/stats/count/faculty', require('./routes/api/stats/count/faculty'));
app.use('/api/stats/count/challenges', require('./routes/api/stats/count/challenges'));
app.use('/api/stats/count/subjects', require('./routes/api/stats/count/subject'));

app.all('*', (req, res) => {
    return res.status(404).send('404 page not found');
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(1337, () => console.log('Listening on port 1337'))
});
