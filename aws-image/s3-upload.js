const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client } = require('@aws-sdk/client-s3');

const sharp = require('sharp');
require('dotenv').config();

// s3 settings and credentials
const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

exports.sharpify = async (file, maxHeight, maxWidth) => {
  try {
    const image = sharp(file.buffer);
    const meta = await image.metadata();
    const { format } = meta;
    const config = {
      jpeg: { quality: 100 },
      webp: { quality: 100 },
      png: { quality: 100 }
    };

    const newFile = await image[format](config[format])
      .resize({
        height: maxHeight,
        width: null,
        withoutEnlargement: true
      })
      .resize({
        height: null,
        width: maxWidth,
        withoutEnlargement: true
      });

    return newFile;
  }
  catch (err) {
    throw new Error(err);
  }
};

exports.upload_image = async (file, key) => {
  const input = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: file
  };
  try {
    const parallelUploads3 = new Upload({
      client: s3,
      params: input
    });
    await parallelUploads3.done();
  }
  catch (err) {
    throw new Error(err);
  }
};
