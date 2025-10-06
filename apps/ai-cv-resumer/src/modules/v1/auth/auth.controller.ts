import { IApiResponse } from '@global/interfaces/response.interface';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and return access token.',
  })
  @ApiBody({
    description:
      'Login using this credential. Email: developer@email.com Password: developer',
    type: LoginDto,
  })
  async login(@Body() payload: LoginDto): Promise<
    IApiResponse<{
      accessToken: string;
    }>
  > {
    const resp = await this.authService.login(payload);
    return {
      message: 'success',
      data: {
        accessToken: resp.accessToken,
      },
    };
  }
}
