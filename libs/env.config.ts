import * as dotenv from 'dotenv';
import e from 'express';
import { parse } from 'path';
dotenv.config({ path: 'libs/.env' });

export const libraryENVConfig = {
  s3: {
    region: process.env.AWS_REGION || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucketName: process.env.AWS_S3_BUCKET_NAME || '',
    endpoint: process.env.AWS_S3_ENDPOINT || '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  chroma: {
    host: process.env.CHROMA_HOST || 'localhost',
    port: parseInt(process.env.CHROMA_PORT) || 21131,
  },
};
