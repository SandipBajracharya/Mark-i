import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationLoginDto } from './dto/authentication-login.dto';
import JoiValidationPipe from 'src/common/validation/joi.validation.pipe';
import { authenticationSchema } from './authentication.validation';
import { UsersService } from '../users/users.service';
import { matchPassword } from 'src/utils/password';
import { JwtAuthService } from 'src/provider/jwt.service.provider';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtAuthService,
  ) {}

  @Post('/login')
  async login(
    @Body(new JoiValidationPipe(authenticationSchema))
    authenticationLoginDto: AuthenticationLoginDto,
  ) {
    // 1. check if user with the email is in database
    const userInfo = await this.userService.findOneWithEmail(
      authenticationLoginDto.email,
    );
    if (!userInfo) throw new Error('User with the given email is not found!');

    // 2. check if password matches
    const isMatchedPassword = await matchPassword(
      authenticationLoginDto.password,
      userInfo?.password,
    );

    if (!isMatchedPassword) throw new Error('Credentials do not match!');

    const token = await this.jwtService.generateToken(userInfo);

    return { data: { tokenType: 'Bearer', token }, message: 'Login success' };
  }

  @Post('/register')
  async register(@Body() authenticationRegisterDto: CreateUserDto) {
    try {
      // 1. Create User logic
      const user = await this.userService.create(authenticationRegisterDto);

      // 2. Send email for verification
      return { data: user, message: 'Registration success' };
    } catch (error) {
      return { message: error.message };
    }
  }
}
