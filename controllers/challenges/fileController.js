const minioClient = require('../../config/fsCon');

const handleFileUpload = (req, res) => {
    const files = req.files;

    const bucketName = process.env.MINIO_CHALLENGE_BUCKET_NAME;

    /* Save files */
    Object.keys(files).forEach(key => {
        const objectName = files[key].name;
        minioClient.putObject(bucketName, objectName, files[key].data, (err, objInfo) => {
            if (err) {
                return res.status(500).json({ status: "error", message: err.message });
            }
            /* Debug: log the etags of uploaded blob */
            console.log(objInfo.etag);
            /* TODO: Add etag (MD5 value) of blob to corresponding challenge's database entry */
        });
    });
    return res.json({ status: 'Success', message: 'All files uploaded successfully.' });
}

const handleFileDownload = (req, res) => {
    const bucketName = process.env.MINIO_CHALLENGE_BUCKET_NAME;
    const objectEtag = req.params.etag;
    
    let found = false;

    const stream = minioClient.listObjects(bucketName, '', false);

    stream.on('error', (err) => {
        /* Debug: log error in listing bucket contents */
        console.error(err);
        return res.status(500).json({ status: 'Failed', message: 'Bucket listing failed.'});
    });

    stream.on('data', (object) => {
        if (found) {
            return;
        }

        if (object.etag.toString() === objectEtag.toString()) {
            found = true;
            minioClient.getObject(bucketName, object.name, (err, dataStream) => {
                if (err) {
                    /* Debug: log error while retrieving file */
                    console.error(err);
                    return res.status(500).json({ status: 'Failed', message: 'Failed to fetch file.'});
                }
    
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${object.name}"`);
                dataStream.pipe(res);
            });
        }
    });
    
    stream.on('end', (object) => {
        if (!found) {
            return res.status(404).json({ status: 'Failed', message: 'File not found.' });
        }
    });
}

module.exports = {
    handleFileUpload,
    handleFileDownload
};