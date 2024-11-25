import { Controller, Post, Body, UseGuards, Request, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register-user.dto';
import { LoginDto } from '../dto/login-user.dto';
import { AuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Successfully registered a user!',
      data: user,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

@UseGuards(AuthGuard)
@Post('logout')
async logout(@Request() req) {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    throw new UnauthorizedException('No token provided');
  }
  await this.authService.logout(token);
  return {
    status: HttpStatus.OK,
    message: 'Successfully logged out',
  };
}

}