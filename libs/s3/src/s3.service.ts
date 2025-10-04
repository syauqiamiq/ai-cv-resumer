/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// services/s3.service.ts
import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  ObjectCannedACL,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { libraryENVConfig } from 'libs/env.config';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      endpoint: libraryENVConfig.s3.endpoint || undefined,
      forcePathStyle: true,
      credentials: {
        accessKeyId: libraryENVConfig.s3.accessKeyId,
        secretAccessKey: libraryENVConfig.s3.secretAccessKey,
      },
    });
  }

  /**
   * Upload a file to S3
   * @param bucketName - The name of the S3 bucket
   * @param key - The key for the uploaded file
   * @param buffer - The file content as a Buffer
   * @param contentType - The MIME type of the file
   * @returns The public URL of the uploaded file
   */
  async uploadFile(
    bucketName: string,
    key: string,
    buffer: Buffer,
    contentType: string,
    ACL: ObjectCannedACL = 'private',
  ): Promise<string> {
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: ACL,
    };

    await this.s3.send(new PutObjectCommand(params));
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  }

  /**
   * Get a file from S3 for temporary processing
   * @param bucketName - The name of the S3 bucket
   * @param key - The key of the file
   * @returns A readable Get of the file content
   */
  async getFile(
    bucketName: string,
    key: string,
  ): Promise<GetObjectCommandOutput> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const response = await this.s3.send(new GetObjectCommand(params));

    return response;
  }

  /**
   * Get a file from S3 for temporary processing
   * @param bucketName - The name of the S3 bucket
   * @param key - The key of the file
   * @returns A temporary s3 url of the file content
   */
  async getTemporaryUrl(
    bucketName: string,
    key: string,
    expireInSecond?: number,
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(params);

    const url = await getSignedUrl(
      {
        config: this.s3.config,
        destroy: this.s3.destroy,
        middlewareStack: this.s3.middlewareStack,
        send: this.s3.send,
      },
      command,
      {
        expiresIn: expireInSecond || 180,
      },
    );

    return url;
  }

  /**
   * Delete a file from S3
   * @param bucketName - The name of the S3 bucket
   * @param key - The key of the file to delete
   */
  async deleteFile(bucketName: string, key: string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    await this.s3.send(new DeleteObjectCommand(params));
  }
}
