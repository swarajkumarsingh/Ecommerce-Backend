const AWS = require("aws-sdk");
const keys = require("../keys");
AWS.config.update({
  region: keys.region,
  accessKeyId: keys.awsAccessKeyId,
  secretAccessKey: keys.awsSecretAccessKey,
});

const s3 = new AWS.S3();

const signFileUrl = async (
  key,
  fileType,
  bucketName = keys.bucketName,
  baseUrl = keys.cdnUrl
) => {
  return new Promise((resolve) => {
    const s3Params = {
      Bucket: bucketName,
      Key: key,
      Expires: 900,
      ContentType: fileType,
      ACL: "public-read",
    };
    s3.getSignedUrl("putObject", s3Params, (err, data) => {
      if (err) {
        console.log(err, `Error While Signing S3 File Upload URL.`);
        resolve({});
      } else {
        resolve({
          data: {
            signedRequest: data,
            url: `${baseUrl}${s3Params.Key}`,
          },
        });
      }
    });
  });
};

module.exports = {
  signFileUrl,
};
