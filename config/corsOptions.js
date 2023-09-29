const whitelist = [
    'http://127.0.0.1:1337',
    'http://localhost:1337'
];

const corsOptions = {
    origin: (origin, callback) => {
        /* origin is undefined if resource is requested from localhost */
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;