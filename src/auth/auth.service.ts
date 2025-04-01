import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignupUserDTO } from './dto/signup-user-dto';
import { LoginUserDTO } from './dto/login-user-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.checkExistingUserEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserDTO: LoginUserDTO) {
    const email = loginUserDTO.email;
    const user = await this.userService.checkExistingUserEmail(email);

    // check if email does exist or not
    if(!user){
      return {
        statusCode: 400,
        message: "Email has not been signed up yet"
      }
    }

    const isMatch = await bcrypt.compare(loginUserDTO.password, user.password);

    // check if the password is right
    if(!isMatch){
      return {
        statusCode: 400,
        message: "Email or password is wrong"
      }
    }

    // login successful, return access token
    const payload = { sub: user.id,  role: user.role};
    const access_token = await this.jwtService.signAsync(payload);

    return {
      statusCode: 200,
      message: "Login successfully",
      access_token: access_token
    }

  }

  async signup(signupUserDTO: SignupUserDTO){
    const email = signupUserDTO.email;
    const user = await this.userService.checkExistingUserEmail(email);

    // check if the email is signed up or not
    if(user){
      return {
        statusCode: 400,
        message: "This email has been signed up already"
      }
    }

    // hashing the password before store
    const password = await bcrypt.hash(signupUserDTO.password, 10);
    signupUserDTO.password = password;

    // store new user to database
    await this.userService.createUser(signupUserDTO);

    return {
      statusCode: 200,
      message: "Signup successfully"
    }
  }
}