const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'hack2sec-minio-server',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_DEMO_USER_RW_ACCESS_KEY,
    secretKey: process.env.MINIO_DEMO_USER_RW_SECRET_KEY
});

module.exports = minioClient;
