import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 3600,
    required: false,
  })
  expiresIn?: number;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    default: 'Bearer',
    required: false,
  })
  tokenType?: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      name: 'John Doe',
    },
    required: false,
  })
  user?: {
    id: string;
    email: string;
    name: string;
  };
}
