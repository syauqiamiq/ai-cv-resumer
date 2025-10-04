import * as dotenv from 'dotenv';
dotenv.config({ path: 'libs/.env' });

export const libraryENVConfig = {
  s3: {
    region: process.env.AWS_REGION || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucketName: process.env.AWS_S3_BUCKET_NAME || '',
  },
};
