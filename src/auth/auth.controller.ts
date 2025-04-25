import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginUserDTO } from './dto/login-user-dto';
import { SignupUserDTO } from './dto/signup-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @Public()
  login(@Body() loginUserDTO: LoginUserDTO){
    return this.authService.login(loginUserDTO)
  }

  @Post('/signup')
  @Public()
  signup(@Body() signupUserDTO: SignupUserDTO){
      return this.authService.signup(signupUserDTO);
  }
}
