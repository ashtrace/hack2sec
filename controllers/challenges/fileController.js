const minioClient = require('../../config/fsCon');
const AdmZip      = require('adm-zip');

const handleFileUpload = (req, res) => {
    const files = req.files;
    const bucketName = process.env.MINIO_CHALLENGE_BUCKET_NAME;
    const timestamp = Date.now();
    let zipFileName = '';
    
    Object.keys(files).forEach(key => {
        zipFileName += files[key].name.replace(' ', '-') + '_';
    });

    zipFileName += `${timestamp}.zip`;
    console.log(zipFileName);

    try {
        const zip = new AdmZip();

        Object.keys(files).forEach(key => {
            zip.addFile(files[key].name, files[key].data);
        });

        const zipData = zip.toBuffer();

        minioClient.putObject(bucketName, zipFileName, zipData, (err, objInfo) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ 'message': 'Failed to upload challenge files.' });
            } else {
                return res.json({ 'filename': zipFileName });
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Failed to upload challenge files.' });
    }
}

const handleFileDownload = (req, res) => {
    const bucketName = process.env.MINIO_CHALLENGE_BUCKET_NAME;

    if (!req?.params?.filename) {
        return res.status(400).json({ 'message': 'Filename is required.' });
    }

    const objectName = req.params.filename;

    minioClient.getObject(bucketName, objectName, (err, dataStream) => {
        if (err) {
            console.error(err);
            return res.status(404).send('File not found.');
        }

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${objectName}"`);
        dataStream.pipe(res);
    });
}

function deleteFile(filename) {
    const bucketName = process.env.MINIO_CHALLENGE_BUCKET_NAME;

    try {
        minioClient.removeObject(bucketName, filename);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    handleFileUpload,
    handleFileDownload,
    deleteFile
};