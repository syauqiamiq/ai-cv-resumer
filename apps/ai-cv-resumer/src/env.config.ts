import * as dotenv from 'dotenv';
dotenv.config({ path: 'apps/ai-cv-resumer/.env' });

export const aiCvResumerENVConfig = {
  app: {
    env: process.env.APP_ENV || 'development',
    runningPort: process.env.RUNNING_PORT || 3000,
    host: process.env.RUNNING_HOST || 'localhost',
    allowedFrontendUrl: process.env.ALLOWED_FRONTEND_URL || '',
    aesEncryptionKey: process.env.AES_ENCRYPTION_KEY,
  },
  document: {
    signatureKeyV1: process.env.DOC_SIGNATURE_KEY_V1,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    name: process.env.DB_NAME || 'postgres',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    username: process.env.SMTP_USERNAME || '',
    password: process.env.SMTP_PASSWORD || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
  },
  aws: {
    region: process.env.AWS_REGION || '',
    s3: {
      bucketName: process.env.S3_BUCKET_NAME || '',
      accessPoint: process.env.S3_ACCESS_POINT || '',
    },
    sqs: {
      emailQueue: {
        queueName: process.env.SQS_EMAIL_QUEUE_NAME || '',
        queueUrl: process.env.SQS_EMAIL_QUEUE_URL || '',
      },
      mobilePushNotificationQueue: {
        queueName: process.env.SQS_PUSH_NOTIFICATION_QUEUE_NAME || '',
        queueUrl: process.env.SQS_PUSH_NOTIFICATION_QUEUE_URL || '',
      },
    },
  },
  jwt: {
    jwtEmployeeSecret: process.env.JWT_EMPLOYEE_SECRET || '',
    jwtEmployeeExpire: process.env.JWT_EMPLOYEE_EXPIRE || '',
  },
  redis: {
    host: process.env.REDIS_HOST || 'admin',
    port: process.env.REDIS_PORT || 6379,
    pass: process.env.REDIS_PASS || 'admin',
  },
  cookie: {
    domain: process.env.COOKIE_DOMAIN || 'localhost',
  },
  externalService: {
    asset: {
      baseUrl: process.env.ASSET_SERVICE_URL || 'http://localhost:9999',
      apiKey: process.env.ASSET_SERVICE_API_KEY || '',
    },
    core: {
      baseUrl: process.env.CORE_SERVICE_URL || 'http://localhost:9999',
      apiKey: process.env.CORE_SERVICE_API_KEY || '',
    },

    deepFace: {
      baseUrl: process.env.DEEP_FACE_SERVICE_URL || '',
    },
  },
  //   failedLoginMaxAttempts: parseInt(process.env.FAILED_LOGIN_MAX_ATTEMPTS) || 3,
};
