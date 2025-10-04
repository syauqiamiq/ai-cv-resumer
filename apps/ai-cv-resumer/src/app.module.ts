import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';

import { S3Module } from '@app/s3';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { databaseConfig } from './databases/database-config';
import { aiCvResumerENVConfig } from './env.config';
import { UserAttachmentModule } from './modules/v1/user-attachment/user-attachment.module';
import { EvaluationJobModule } from './modules/v1/evaluation-job/evaluation-job.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    JwtModule.register({
      global: true,
      secret: aiCvResumerENVConfig.jwt.jwtSecret,
      signOptions: {
        expiresIn: aiCvResumerENVConfig.jwt.jwtExpire,
      },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    S3Module,
    UserAttachmentModule,
    EvaluationJobModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
