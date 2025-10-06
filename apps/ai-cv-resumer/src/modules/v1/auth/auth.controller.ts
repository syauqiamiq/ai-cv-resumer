import { IApiResponse } from '@global/interfaces/response.interface';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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
