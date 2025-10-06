import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/ai-cv-resumer/src/databases/entities/user.entity';
import { aiCvResumerENVConfig } from 'apps/ai-cv-resumer/src/env.config';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { LoginDto } from './dto/request/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async login(payload: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      throw new BadRequestException('Email or Password Incorrect');
    }

    const isValidPassword = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Username or Password Incorrect');
    }

    const jwtAccessTokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(jwtAccessTokenPayload, {
      expiresIn: '1d',
      secret: aiCvResumerENVConfig.jwt.jwtSecret,
    });

    return {
      accessToken,
    };
  }
}
