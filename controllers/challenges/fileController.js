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
    const objectName = req.params.filename;
  
    minioClient.getObject(bucketName, objectName, (error, dataStream) => {
      if (error) {
        console.error(error);
        return res.status(404).send('File not found.');
      }

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${objectName}"`);
      dataStream.pipe(res);
    })
}

module.exports = {
    handleFileUpload,
    handleFileDownload
};